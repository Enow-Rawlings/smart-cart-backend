const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { logInteraction } = require('../services/interactionService');
const { getBestDiscount, getLivePromotions } = require('../services/promotionService');


const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    // attach live promotion info to each cart item's product, so the frontend can show discounted totals
    const livePromotions = await getLivePromotions();
    const cartObj = cart.toObject();
    cartObj.items = cartObj.items.map((item) => {
      if (!item.productId) return item; // product may have been deleted
      const promotion = getBestDiscount(item.productId, livePromotions);
      return { ...item, productId: { ...item.productId, promotion } };
    });

    res.status(200).json({ cart: cartObj });
  } catch (err) {
    console.error('Get cart error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const addItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const existingItem = cart.items.find((item) => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
await cart.populate('items.productId');

logInteraction({ userId: req.user._id, productId, type: 'add_to_cart' });

const livePromotions = await getLivePromotions();
const cartObj = cart.toObject();
cartObj.items = cartObj.items.map((item) => {
  if (!item.productId) return item;
  const promotion = getBestDiscount(item.productId, livePromotions);
  return { ...item, productId: { ...item.productId, promotion } };
});

res.status(200).json({ cart: cartObj });
  } catch (err) {
    console.error('Add item error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find((item) => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.productId');

    res.status(200).json({ cart });
  } catch (err) {
    console.error('Update item error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();
    await cart.populate('items.productId');

    res.status(200).json({ cart });
  } catch (err) {
    console.error('Remove item error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCart, addItem, updateItem, removeItem };