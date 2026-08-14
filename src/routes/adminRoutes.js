const express = require('express');
const {
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  getAdminAnalytics,
  updateUserRole,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/analytics', getAdminAnalytics);

module.exports = router;