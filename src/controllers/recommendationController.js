const Product = require('../models/Product');
const InteractionLog = require('../models/InteractionLog');
const { getPersonalizedRecommendations } = require('../services/recommendationService');

const getTrending = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find()
      .sort({ popularityScore: -1 })
      .limit(Number(limit));

    res.status(200).json({
      type: 'trending',
      products,
    });
  } catch (err) {
    console.error('Get trending error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecentlyViewed = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // get the user's most recent view events, most recent first
    const logs = await InteractionLog.find({ userId: req.user._id, type: 'view' })
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 2) // grab extra in case of duplicate products
      .populate('productId');

    // de-duplicate by product, keeping the most recent view of each
    const seen = new Set();
    const products = [];

    for (const log of logs) {
      if (!log.productId) continue; // product may have been deleted
      const id = log.productId._id.toString();
      if (!seen.has(id)) {
        seen.add(id);
        products.push(log.productId);
      }
      if (products.length >= Number(limit)) break;
    }

    res.status(200).json({ type: 'recently_viewed', products });
  } catch (err) {
    console.error('Get recently viewed error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// const Product = require('../models/Product');

const getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 10 } = req.query;

    const baseProduct = await Product.findById(productId);
    if (!baseProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const candidates = await Product.find({
      _id: { $ne: baseProduct._id },
      category: baseProduct.category,
    });

    const scored = candidates.map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => baseProduct.tags.includes(tag)).length;
      const totalTags = new Set([...candidate.tags, ...baseProduct.tags]).size;
      const tagSimilarity = totalTags > 0 ? sharedTags / totalTags : 0;

      const brandMatch = candidate.brand && candidate.brand === baseProduct.brand ? 0.3 : 0;

      const score = tagSimilarity * 0.7 + brandMatch;

      return { product: candidate, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const top = scored.slice(0, Number(limit));
    const maxScore = top.length > 0 ? Math.max(...top.map((s) => s.score), 0.0001) : 1;

    const products = top.map((s) => ({
      ...s.product.toObject(),
      confidence: Number((s.score / maxScore).toFixed(2)),
    }));

    res.status(200).json({ type: 'similar', products });
  } catch (err) {
    console.error('Get similar products error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const products = await Product.find({ category })
      .sort({ popularityScore: -1 })
      .limit(Number(limit));

    res.status(200).json({ type: 'category', category, products });
  } catch (err) {
    console.error('Get by category error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPurchaseHistoryBased = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // find categories the user has purchased from, via their purchase logs
    const purchaseLogs = await InteractionLog.find({
      userId: req.user._id,
      type: 'purchase',
    }).populate('productId');

    if (purchaseLogs.length === 0) {
      return res.status(200).json({ type: 'purchase_history', products: [] });
    }

    const purchasedProductIds = new Set(
      purchaseLogs.filter((l) => l.productId).map((l) => l.productId._id.toString())
    );

    const purchasedCategories = [
      ...new Set(purchaseLogs.filter((l) => l.productId).map((l) => l.productId.category)),
    ];

    // recommend other products in those categories, excluding ones already bought
    const products = await Product.find({
      category: { $in: purchasedCategories },
      _id: { $nin: [...purchasedProductIds] },
    })
      .sort({ popularityScore: -1 })
      .limit(Number(limit));

    res.status(200).json({ type: 'purchase_history', products });
  } catch (err) {
    console.error('Get purchase history recs error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPersonalized = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const { products, isColdStart } = await getPersonalizedRecommendations(
      req.user,
      Number(limit)
    );

    res.status(200).json({ type: 'personalized', isColdStart, products });
  } catch (err) {
    console.error('Get personalized error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTrending, getRecentlyViewed, getSimilarProducts, getByCategory, getPurchaseHistoryBased, getPersonalized };