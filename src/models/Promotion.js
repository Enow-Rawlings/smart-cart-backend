const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    scope: {
      type: String,
      enum: ['all', 'category'],
      required: true,
    },
    category: {
      type: String, // only used when scope === 'category'
      lowercase: true,
      default: null,
    },
    bannerImage: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    active: {
      type: Boolean,
      default: true, // admin can manually pause without deleting
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Promotion', promotionSchema);