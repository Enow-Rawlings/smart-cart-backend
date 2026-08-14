const express = require('express');
const { getFeatured, updateFeatured } = require('../controllers/featuredController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getFeatured); // public
router.put('/', protect, adminOnly, updateFeatured);

module.exports = router;