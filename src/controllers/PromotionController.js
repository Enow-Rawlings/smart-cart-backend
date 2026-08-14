const Promotion = require('../models/Promotion');
const { uploadBufferToCloudinary } = require('../config/cloudinary');
const { getLivePromotions } = require('../services/promotionService');

const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    res.status(200).json({ promotions });
  } catch (err) {
    console.error('Get promotions error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// public — used to show active banners to shoppers, no auth required
const getActivePromotions = async (req, res) => {
  try {
    const promotions = await getLivePromotions();
    res.status(200).json({ promotions });
  } catch (err) {
    console.error('Get active promotions error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createPromotion = async (req, res) => {
  try {
    const { title, description, discountType, discountValue, scope, category, startDate, endDate } = req.body;

    if (!title || !discountType || discountValue === undefined || !scope || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (scope === 'category' && !category) {
      return res.status(400).json({ message: 'category is required when scope is "category"' });
    }
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'startDate must be before endDate' });
    }

    const promotion = await Promotion.create({
      title, description, discountType, discountValue, scope,
      category: scope === 'category' ? category : null,
      startDate, endDate,
    });

    res.status(201).json({ promotion });
  } catch (err) {
    console.error('Create promotion error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.status(200).json({ promotion });
  } catch (err) {
    console.error('Update promotion error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findByIdAndDelete(id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.status(200).json({ message: 'Promotion deleted' });
  } catch (err) {
    console.error('Delete promotion error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadPromotionBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    const result = await uploadBufferToCloudinary(req.file.buffer, 'smartcart/promotions');
    promotion.bannerImage = result.secure_url;
    await promotion.save();
    res.status(200).json({ promotion });
  } catch (err) {
    console.error('Upload promotion banner error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllPromotions,
  getActivePromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  uploadPromotionBanner,
};