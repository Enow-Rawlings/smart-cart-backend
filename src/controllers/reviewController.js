const Review  = require('../models/Review');
const Product = require('../models/Product');
const Order   = require('../models/Order');

/* ── Recalculate product avgRating + ratingCount ── */
const recalcRating = async (productId) => {
  const reviews = await Review.find({ productId });
  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, { avgRating: 0, ratingCount: 0 });
    return;
  }
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(productId, {
    avgRating:   parseFloat(avg.toFixed(2)),
    ratingCount: reviews.length,
  });
};

/* ── GET /api/reviews/:productId ── */
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* ── POST /api/reviews/:productId ── (requires auth) */
const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, title, body } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if the user has purchased this product (for verifiedPurchase badge)
    const hasPurchased = await Order.exists({
      userId: req.user._id,
      status: { $in: ['paid', 'shipped', 'delivered'] },
      'items.productId': productId,
    });

    // Upsert: update existing review or create new one
    const review = await Review.findOneAndUpdate(
      { productId, userId: req.user._id },
      {
        rating,
        title: title || '',
        body: body || '',
        verifiedPurchase: !!hasPurchased,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await recalcRating(productId);

    const populated = await review.populate('userId', 'name');
    res.status(201).json({ review: populated });
  } catch (err) {
    console.error('Create review error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ── DELETE /api/reviews/:productId ── (own review) */
const deleteReview = async (req, res) => {
  try {
    const { productId } = req.params;
    await Review.findOneAndDelete({ productId, userId: req.user._id });
    await recalcRating(productId);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* ── GET /api/reviews/:productId/me ── did the current user review this? */
const getMyReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const review = await Review.findOne({ productId, userId: req.user._id });
    res.json({ review });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProductReviews, createReview, deleteReview, getMyReview };
