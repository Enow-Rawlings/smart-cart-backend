const InteractionLog = require('../models/InteractionLog');
const Order = require('../models/Order');

const getMyAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const orderStats = await Order.aggregate([
      { $match: { userId, status: { $in: ['paid', 'shipped', 'delivered'] } } },
      { $group: { _id: null, totalSpent: { $sum: '$totalAmount' }, orderCount: { $sum: 1 } } },
    ]);

    // real spending per category — joins order line items to products, sums actual $ spent
    const categorySpending = await Order.aggregate([
      { $match: { userId, status: { $in: ['paid', 'shipped', 'delivered'] } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          amount: { $sum: { $multiply: ['$items.priceAtPurchase', '$items.quantity'] } },
        },
      },
      { $sort: { amount: -1 } },
    ]);

    const totalCategorySpend = categorySpending.reduce((sum, c) => sum + c.amount, 0);
    const categorySpendingWithPct = categorySpending.map((c) => ({
      category: c._id,
      amount: c.amount,
      percentage: totalCategorySpend > 0 ? Math.round((c.amount / totalCategorySpend) * 100) : 0,
    }));

    const totalSpent = orderStats[0]?.totalSpent || 0;
    const orderCount = orderStats[0]?.orderCount || 0;

    res.status(200).json({
      totalSpent,
      orderCount,
      avgOrderValue: orderCount > 0 ? totalSpent / orderCount : 0,
      favoriteCategory: categorySpendingWithPct[0]?.category || null,
      categorySpending: categorySpendingWithPct,
    });
  } catch (err) {
    console.error('Get my analytics error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMyAnalytics };