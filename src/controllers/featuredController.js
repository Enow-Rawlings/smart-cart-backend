const FeaturedSelection = require('../models/FeaturedSelection');
const Product = require('../models/Product');
const { applyPromotionsToProducts } = require('../services/promotionService');

const getFeatured = async (req, res) => {
  try {
    const selection = await FeaturedSelection.getSingleton();
    await selection.populate('heroProductIds');
    await selection.populate('trendingProductIds');

    let heroProducts = selection.heroProductIds;
    let trendingProducts = selection.trendingProductIds;
    let heroIsCurated = heroProducts.length > 0;
    let trendingIsCurated = trendingProducts.length > 0;

    // Fall back to the real popularity-based algorithm if the admin hasn't curated a selection —
    // the storefront should never show an empty section just because nothing was manually chosen.
    if (!heroIsCurated) {
      heroProducts = await Product.find().sort({ popularityScore: -1 }).limit(3);
    }
    if (!trendingIsCurated) {
      trendingProducts = await Product.find().sort({ popularityScore: -1 }).limit(8);
    }

    heroProducts = await applyPromotionsToProducts(heroProducts);
    trendingProducts = await applyPromotionsToProducts(trendingProducts);

    res.status(200).json({
      heroProducts,
      trendingProducts,
      heroIsCurated,
      trendingIsCurated,
    });
  } catch (err) {
    console.error('Get featured error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateFeatured = async (req, res) => {
  try {
    const { heroProductIds, trendingProductIds } = req.body;
    const selection = await FeaturedSelection.getSingleton();

    if (heroProductIds !== undefined) selection.heroProductIds = heroProductIds;
    if (trendingProductIds !== undefined) selection.trendingProductIds = trendingProductIds;

    await selection.save();
    await selection.populate('heroProductIds');
    await selection.populate('trendingProductIds');

    res.status(200).json({ selection });
  } catch (err) {
    console.error('Update featured error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getFeatured, updateFeatured };