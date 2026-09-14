const Product = require('../models/Product');
const { uploadBufferToCloudinary } = require('../config/cloudinary');
const { logInteraction } = require('../services/interactionService');
const { applyPromotionsToProducts } = require('../services/promotionService');

const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ popularityScore: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    const withPromotions = await applyPromotionsToProducts(products);

    res.status(200).json({
      products: withPromotions,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    console.error('Get products error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand', { brand: { $ne: '' } });
    res.status(200).json({ brands });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getPublicStats = async (req, res) => {
  try {
    const [totalProducts, cats, brands] = await Promise.all([
      Product.countDocuments(),
      Product.distinct('category'),
      Product.distinct('brand', { brand: { $ne: '' } }),
    ]);
    res.status(200).json({ totalProducts, totalCategories: cats.length, totalBrands: brands.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (req.user) logInteraction({ userId: req.user._id, productId: product._id, type: 'view' });
    // applyPromotionsToProducts is async and takes only the products array
    const [withPromo] = await applyPromotionsToProducts([product]);
    res.status(200).json({ product: withPromo });
  } catch (err) {
    console.error('Get product by id error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // uploadBufferToCloudinary now returns the secure_url string directly
    const url = await uploadBufferToCloudinary(req.file.buffer, 'products');
    product.images.push(url);
    await product.save();
    res.status(200).json({ product });
  } catch (err) {
    console.error('Upload image error:', err.message, err);
    res.status(500).json({ message: err.message || 'Image upload failed' });
  }
};

const removeProductImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.images = product.images.filter(img => img !== imageUrl);
    await product.save();
    res.status(200).json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ── STOCK NOTIFY ──────────────────────────────────────────────────────────────
// POST /api/products/:id/notify  (protected)
const requestStockNotify = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock > 0) return res.status(400).json({ message: 'Product is already in stock' });

    const userId = req.user._id.toString();
    const alreadyAdded = product.stockNotifyList.map(id => id.toString()).includes(userId);
    if (!alreadyAdded) {
      product.stockNotifyList.push(req.user._id);
      await product.save();
    }
    res.status(200).json({ message: 'You will be notified when this product is back in stock.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/products/:id/notify  (protected) — remove self from list
const cancelStockNotify = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.stockNotifyList = product.stockNotifyList.filter(
      id => id.toString() !== req.user._id.toString()
    );
    await product.save();
    res.status(200).json({ message: 'Notification cancelled.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts, getCategories, getBrands, getPublicStats,
  getProductById, createProduct, updateProduct, deleteProduct,
  uploadProductImage, removeProductImage,
  requestStockNotify, cancelStockNotify,
};
