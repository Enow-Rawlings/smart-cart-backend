const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String, // Cloudinary URL — background photo for category tiles
      default: '',
    },
    icon: {
      type: String, // Cloudinary URL — small icon shown on tiles
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);