const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const InteractionLog = require('../models/InteractionLog');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (err) {
    console.error('Get all users error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'role must be "customer" or "admin"' });
    }

    // prevent an admin from accidentally demoting themselves out of admin access
    if (id === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('Update user role error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'name price')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    console.error('Get all orders error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (err) {
    console.error('Update order status error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAdminAnalytics = async (req, res) => {
  try {
    // total revenue and order count from paid+ orders
    const revenueStats = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'shipped', 'delivered'] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // top 5 categories by number of purchase interactions
    const topCategories = await InteractionLog.aggregate([
      { $match: { type: 'purchase' } },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      { $group: { _id: '$product.category', purchaseCount: { $sum: 1 } } },
      { $sort: { purchaseCount: -1 } },
      { $limit: 5 },
    ]);

    // active users: distinct users with any interaction in the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUserIds = await InteractionLog.distinct('userId', {
      createdAt: { $gte: sevenDaysAgo },
    });

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      totalRevenue: revenueStats[0]?.totalRevenue || 0,
      totalOrders: revenueStats[0]?.totalOrders || 0,
      totalUsers,
      totalProducts,
      activeUsersLast7Days: activeUserIds.length,
      topCategories,
    });
  } catch (err) {
    console.error('Get admin analytics error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = { getAllUsers, getAllOrders, updateOrderStatus, getAdminAnalytics, updateUserRole };