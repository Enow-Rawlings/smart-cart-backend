const Category = require('../models/Category');
const { uploadBufferToCloudinary } = require('../config/cloudinary');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ categories });
  } catch (err) {
    console.error('Get categories error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }

    const existing = await Category.findOne({ name: name.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    const category = await Category.create({ name });
    res.status(201).json({ category });
  } catch (err) {
    console.error('Create category error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ category });
  } catch (err) {
    console.error('Update category error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    console.error('Delete category error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadCategoryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { field } = req.params; // 'image' or 'icon'

    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    if (!['image', 'icon'].includes(field)) {
      return res.status(400).json({ message: 'field must be "image" or "icon"' });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, `smartcart/categories/${field}`);
    category[field] = result.secure_url;
    await category.save();

    res.status(200).json({ category });
  } catch (err) {
    console.error('Upload category asset error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
};