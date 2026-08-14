const mongoose = require('mongoose');

const featuredSelectionSchema = new mongoose.Schema(
  {
    heroProductIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
      default: [],
    },
    trendingProductIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
      default: [],
    },
  },
  { timestamps: true }
);

featuredSelectionSchema.statics.getSingleton = async function () {
  let selection = await this.findOne();
  if (!selection) {
    selection = await this.create({});
  }
  return selection;
};

module.exports = mongoose.model('FeaturedSelection', featuredSelectionSchema);