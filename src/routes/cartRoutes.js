const express = require('express');
const { getCart, addItem, updateItem, removeItem } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getCart);
router.post('/items', protect, addItem);
router.put('/items/:productId', protect, updateItem);
router.delete('/items/:productId', protect, removeItem);

module.exports = router;