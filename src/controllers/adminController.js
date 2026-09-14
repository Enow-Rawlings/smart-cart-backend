const User         = require('../models/User');
const Order        = require('../models/Order');
const Product      = require('../models/Product');
const InteractionLog = require('../models/InteractionLog');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (err) {
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
    if (id === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user });
  } catch (err) {
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
    res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${valid.join(', ')}` });
    }
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAdminAnalytics = async (req, res) => {
  try {
    // ── Core metrics ──────────────────────────────────────
    const [revenueStats, totalUsers, totalProducts] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $in: ['paid', 'shipped', 'delivered'] } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, totalOrders: { $sum: 1 } } },
      ]),
      User.countDocuments(),
      Product.countDocuments(),
    ]);

    // ── Top 5 categories by purchase count ────────────────
    const topCategories = await InteractionLog.aggregate([
      { $match: { type: 'purchase' } },
      { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $group: { _id: '$product.category', purchaseCount: { $sum: 1 } } },
      { $sort: { purchaseCount: -1 } },
      { $limit: 5 },
    ]);

    // ── Active users last 7 days ───────────────────────────
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUserIds = await InteractionLog.distinct('userId', {
      createdAt: { $gte: sevenDaysAgo },
    });

    // ── Revenue over last 30 days (daily buckets) ─────────
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          status: { $in: ['paid', 'shipped', 'delivered'] },
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders:  { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ── Top 5 products by units sold ──────────────────────
    const topProducts = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'shipped', 'delivered'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id:        '$items.productId',
          unitsSold:  { $sum: '$items.quantity' },
          revenue:    { $sum: { $multiply: ['$items.priceAtPurchase', '$items.quantity'] } },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from:         'products',
          localField:   '_id',
          foreignField: '_id',
          as:           'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          unitsSold: 1,
          revenue:   1,
          name:      '$product.name',
          category:  '$product.category',
          price:     '$product.price',
          image:     { $arrayElemAt: ['$product.images', 0] },
        },
      },
    ]);

    res.status(200).json({
      totalRevenue:       revenueStats[0]?.totalRevenue || 0,
      totalOrders:        revenueStats[0]?.totalOrders  || 0,
      totalUsers,
      totalProducts,
      activeUsersLast7Days: activeUserIds.length,
      topCategories,
      dailyRevenue,   // NEW — array of { _id: "YYYY-MM-DD", revenue, orders }
      topProducts,    // NEW — array of { name, unitsSold, revenue, category, image }
    });
  } catch (err) {
    console.error('Admin analytics error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers, getAllOrders, updateOrderStatus,
  getAdminAnalytics, updateUserRole,
};
