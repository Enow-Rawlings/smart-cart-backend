const Product = require('../models/Product');
const { uploadBufferToCloudinary } = require('../config/cloudinary');
const { logInteraction } = require('../services/interactionService');
const { applyPromotionsToProducts, getBestDiscount, getLivePromotions } = require('../services/promotionService');
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

    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // case-insensitive partial match
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [rawProducts, total] = await Promise.all([
  Product.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
  Product.countDocuments(filter),
]);

const products = await applyPromotionsToProducts(rawProducts);

res.status(200).json({
  products,
  pagination: {
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  },
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
    console.error('Get categories error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.status(200).json({ brands: brands.filter(Boolean) }); // drop empty/null brand values
  } catch (err) {
    console.error('Get brands error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPublicStats = async (req, res) => {
  try {
    const [totalProducts, categories, brands] = await Promise.all([
      Product.countDocuments(),
      Product.distinct('category'),
      Product.distinct('brand'),
    ]);

    res.status(200).json({
      totalProducts,
      totalCategories: categories.length,
      totalBrands: brands.filter(Boolean).length,
    });
  } catch (err) {
    console.error('Get public stats error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
if (!product) {
  return res.status(404).json({ message: 'Product not found' });
}

if (req.user) {
  logInteraction({ userId: req.user._id, productId: product._id, type: 'view' });
}

const livePromotions = await getLivePromotions();
const promotion = getBestDiscount(product, livePromotions);

res.status(200).json({ product: { ...product.toObject(), promotion } });
  } catch (err) {
    console.error('Get product error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, category, tags, price, stock, brand } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: 'name, category, and price are required' });
    }

    const product = await Product.create({
      name,
      description,
      category,
      tags,
      price,
      stock,
      brand,
    });

    res.status(201).json({ product });
  } catch (err) {
    console.error('Create product error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true, // return the updated document, not the old one
      runValidators: true, // enforce schema rules (e.g. price min: 0) on update too
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ product });
  } catch (err) {
    console.error('Update product error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, 'smartcart/products');

    product.images.push(result.secure_url);
    await product.save();

    res.status(200).json({ product });
  } catch (err) {
    console.error('Upload image error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'imageUrl is required' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.images = product.images.filter((img) => img !== imageUrl);
    await product.save();

    res.status(200).json({ product });
  } catch (err) {
    console.error('Remove product image error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  getBrands,
  getPublicStats,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  removeProductImage,
};