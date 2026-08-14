const express = require('express');
const {
  getProducts,
  getCategories,
  getBrands,
  getPublicStats,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  removeProductImage
} = require('../controllers/productController');
const { protect, adminOnly, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

console.log('DEBUG - optionalAuth:', typeof optionalAuth, optionalAuth);
console.log('DEBUG - getProductById:', typeof getProductById, getProductById);

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/stats', getPublicStats);
router.get('/:id', optionalAuth, getProductById);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/:id/image', protect, adminOnly, upload.single('image'), uploadProductImage);
router.delete('/:id/image', protect, adminOnly, removeProductImage);

module.exports = router;