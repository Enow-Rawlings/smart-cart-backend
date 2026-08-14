const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
  type: String,
  required: true,
  index: true,
  lowercase: true, // add this line — normalizes "Electronics" -> "electronics" automatically
},
    tags: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String], // Cloudinary URLs, added later
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    brand: {
      type: String,
      default: '',
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    popularityScore: {
      type: Number,
      default: 0,
      index: true, // we'll sort by this for "trending"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);