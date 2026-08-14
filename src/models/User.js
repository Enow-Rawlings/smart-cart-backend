const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    preferences: {
      categories: { type: [String], default: [] },
      priceRange: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
      },
      brands: { type: [String], default: [] },
    },
    wishlist: {
  type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  default: [],
},
resetPasswordToken: {
  type: String,
  default: null,
},
resetPasswordExpires: {
  type: Date,
  default: null,
},
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model('User', userSchema);