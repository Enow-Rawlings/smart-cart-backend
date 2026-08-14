const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'SmartCart',
    },
    primaryColor: {
      type: String,
      default: '#2563eb', // matches our existing blue-600
    },
    logoUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Enforce a single settings document — there's only ever one site configuration
siteSettingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);