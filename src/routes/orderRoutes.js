const express = require('express');
const { checkout, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/checkout', protect, checkout);
router.get('/', protect, getMyOrders);

module.exports = router;