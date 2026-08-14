const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { logInteraction } = require('../services/interactionService');
const { getBestDiscount, getLivePromotions } = require('../services/promotionService');


const checkout = async (req, res) => {
  try {
   const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

if (!cart || cart.items.length === 0) {
  return res.status(400).json({ message: 'Cart is empty' });
}

const livePromotions = await getLivePromotions();

const orderItems = cart.items.map((item) => {
  const promotion = getBestDiscount(item.productId, livePromotions);
  const effectivePrice = promotion ? promotion.finalPrice : item.productId.price;
  return {
    productId: item.productId._id,
    quantity: item.quantity,
    priceAtPurchase: effectivePrice,
  };
});

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      status: 'paid', // simplified — no real payment gateway integration
    });

    // log a purchase interaction for every item bought — strongest signal for recommendations
    orderItems.forEach((item) => {
      logInteraction({ userId: req.user._id, productId: item.productId, type: 'purchase' });
    });

    // clear the cart now that it's been converted to an order
    cart.items = [];
    await cart.save();

    res.status(201).json({ order });
  } catch (err) {
    console.error('Checkout error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    console.error('Get orders error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { checkout , getMyOrders };