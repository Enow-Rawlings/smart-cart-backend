const express = require('express');
const {
  getTrending,
  getRecentlyViewed,
  getSimilarProducts,
  getByCategory,
  getPurchaseHistoryBased,
  getPersonalized,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/trending', getTrending);
router.get('/recently-viewed', protect, getRecentlyViewed);
router.get('/similar/:productId', getSimilarProducts);
router.get('/category/:category', getByCategory);
router.get('/purchase-history', protect, getPurchaseHistoryBased);
router.get('/personalized', protect, getPersonalized);

module.exports = router;