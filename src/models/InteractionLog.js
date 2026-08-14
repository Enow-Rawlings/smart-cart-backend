const mongoose = require('mongoose');

const interactionLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['view', 'search', 'add_to_cart', 'purchase', 'rating'],
      required: true,
      index: true,
    },
    metadata: {
      searchQuery: { type: String },
      rating: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InteractionLog', interactionLogSchema);