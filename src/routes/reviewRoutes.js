const express = require('express');
const {
  getProductReviews,
  createReview,
  deleteReview,
  getMyReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.get('/:productId', getProductReviews);

// Protected
router.post('/:productId',    protect, createReview);
router.delete('/:productId',  protect, deleteReview);
router.get('/:productId/me',  protect, getMyReview);

module.exports = router;
