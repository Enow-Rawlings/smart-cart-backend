const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity:        { type: Number, required: true, min: 1 },
        priceAtPurchase: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    // Shipping details — collected at checkout
    shippingAddress: {
      fullName:    { type: String, default: '' },
      line1:       { type: String, default: '' },
      line2:       { type: String, default: '' },
      city:        { type: String, default: '' },
      state:       { type: String, default: '' },
      postalCode:  { type: String, default: '' },
      country:     { type: String, default: '' },
      phone:       { type: String, default: '' },
    },
    orderNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
