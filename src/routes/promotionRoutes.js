const express = require('express');
const {
  getAllPromotions,
  getActivePromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  uploadPromotionBanner,
} = require('../controllers/PromotionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/active', getActivePromotions); // public
router.get('/', protect, adminOnly, getAllPromotions);
router.post('/', protect, adminOnly, createPromotion);
router.put('/:id', protect, adminOnly, updatePromotion);
router.delete('/:id', protect, adminOnly, deletePromotion);
router.post('/:id/banner', protect, adminOnly, upload.single('file'), uploadPromotionBanner);

module.exports = router;