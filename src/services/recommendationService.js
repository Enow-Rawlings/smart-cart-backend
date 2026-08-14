const Product = require('../models/Product');
const InteractionLog = require('../models/InteractionLog');

// Jaccard similarity between two tag arrays — reused from the "similar products" logic
const tagSimilarity = (tagsA, tagsB) => {
  if (tagsA.length === 0 && tagsB.length === 0) return 0;
  const shared = tagsA.filter((t) => tagsB.includes(t)).length;
  const total = new Set([...tagsA, ...tagsB]).size;
  return total > 0 ? shared / total : 0;
};

const getPersonalizedRecommendations = async (user, limit = 10) => {
  // Pull the user's recent engagement (views + purchases) to build a "taste profile"
  const recentLogs = await InteractionLog.find({
    userId: user._id,
    type: { $in: ['view', 'purchase', 'add_to_cart'] },
  })
    .sort({ createdAt: -1 })
    .limit(30)
    .populate('productId');

  const engagedProducts = recentLogs.filter((l) => l.productId).map((l) => l.productId);
  const engagedProductIds = new Set(engagedProducts.map((p) => p._id.toString()));

  // Purchased categories, for the "Purchase Behavior Weight" term
  const purchasedCategories = new Set(
    recentLogs
      .filter((l) => l.type === 'purchase' && l.productId)
      .map((l) => l.productId.category)
  );

  // COLD START: not enough history — fall back to preferences + popularity only
  const isColdStart = engagedProducts.length < 3;

  // Candidate pool: everything the user hasn't already engaged with
  const candidates = await Product.find({ _id: { $nin: [...engagedProductIds] } });

  if (candidates.length === 0) {
    return { products: [], isColdStart };
  }

  const maxPopularity = Math.max(...candidates.map((p) => p.popularityScore), 1);

  const scored = candidates.map((candidate) => {
    // --- User Preference term: does this match the user's declared preferences? ---
    const prefs = user.preferences || {};
    let userPreference = 0;
    if (prefs.categories?.includes(candidate.category)) userPreference += 0.5;
    if (prefs.brands?.includes(candidate.brand)) userPreference += 0.5;

    // --- Product Similarity term: average tag similarity to recently engaged products ---
    let productSimilarity = 0;
    if (!isColdStart && engagedProducts.length > 0) {
      const similarities = engagedProducts.map((p) => tagSimilarity(candidate.tags, p.tags));
      productSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
    }

    // --- Purchase Behavior Weight: boost if candidate is in a previously purchased category ---
    const purchaseBehaviorWeight = purchasedCategories.has(candidate.category) ? 0.3 : 0;

    // --- Popularity Score: normalized 0-1, acts as the cold-start fallback signal ---
    const popularityScore = candidate.popularityScore / maxPopularity;

    // --- Combine, per thesis formula (§3.5.4) ---
    let rawScore;
    if (isColdStart) {
      // cold start leans on preferences + popularity, since we don't trust similarity yet
      rawScore = userPreference * 0.6 + popularityScore * 0.4;
    } else {
      rawScore = userPreference * productSimilarity + purchaseBehaviorWeight + popularityScore * 0.3;
    }

    return { product: candidate, rawScore };
  });

  scored.sort((a, b) => b.rawScore - a.rawScore);

  const top = scored.slice(0, limit);
  const maxScore = top.length > 0 ? Math.max(...top.map((s) => s.rawScore), 0.0001) : 1;

  const results = top.map((s) => ({
    product: s.product,
    confidence: Number((s.rawScore / maxScore).toFixed(2)),
  }));

  return { products: results, isColdStart };
};

module.exports = { getPersonalizedRecommendations };