const InteractionLog = require('../models/InteractionLog');
const Product = require('../models/Product');

const logInteraction = async ({ userId, productId, type, metadata = {} }) => {
  try {
    await InteractionLog.create({ userId, productId, type, metadata });

    // bump popularity score on meaningful engagement
    if (['view', 'add_to_cart', 'purchase'].includes(type)) {
      const weight = { view: 1, add_to_cart: 3, purchase: 5 }[type];
      await Product.findByIdAndUpdate(productId, { $inc: { popularityScore: weight } });
    }
  } catch (err) {
    // logging should never break the main request — just log the error and move on
    console.error('logInteraction error:', err.message);
  }
};

module.exports = { logInteraction };