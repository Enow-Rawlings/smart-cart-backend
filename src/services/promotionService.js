const Promotion = require('../models/Promotion');

// Returns all promotions that are currently live (active flag + within date range)
const getLivePromotions = async () => {
  const now = new Date();
  return Promotion.find({
    active: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });
};

// Given a product and the list of live promotions, find the best applicable discount.
// If multiple promotions could apply, we pick the one that saves the customer the most —
// a defensible, simple stacking rule worth stating explicitly in the thesis.
const getBestDiscount = (product, livePromotions) => {
  const applicable = livePromotions.filter(
    (promo) => promo.scope === 'all' || (promo.scope === 'category' && promo.category === product.category)
  );

  if (applicable.length === 0) return null;

  let best = null;
  let bestSavings = 0;

  for (const promo of applicable) {
    const savings =
      promo.discountType === 'percentage'
        ? product.price * (promo.discountValue / 100)
        : Math.min(promo.discountValue, product.price); // fixed discount can't exceed the price itself

    if (savings > bestSavings) {
      bestSavings = savings;
      best = promo;
    }
  }

  if (!best) return null;

  const finalPrice = Math.max(0, Number((product.price - bestSavings).toFixed(2)));

  return {
    promotionId: best._id,
    promotionTitle: best.title,
    discountType: best.discountType,
    discountValue: best.discountValue,
    originalPrice: product.price,
    finalPrice,
  };
};

// Attaches a `promotion` field (or null) to each product in a list, based on live promotions.
const applyPromotionsToProducts = async (products) => {
  const livePromotions = await getLivePromotions();
  if (livePromotions.length === 0) {
    return products.map((p) => ({ ...(p.toObject ? p.toObject() : p), promotion: null }));
  }

  return products.map((p) => {
    const plain = p.toObject ? p.toObject() : p;
    return { ...plain, promotion: getBestDiscount(plain, livePromotions) };
  });
};

module.exports = { getLivePromotions, getBestDiscount, applyPromotionsToProducts };