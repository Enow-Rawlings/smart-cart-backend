const SiteSettings = require('../models/SiteSettings');
const { uploadBufferToCloudinary } = require('../config/cloudinary');

const getSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSingleton();
    res.status(200).json({ settings });
  } catch (err) {
    console.error('Get settings error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { siteName, primaryColor } = req.body;
    const settings = await SiteSettings.getSingleton();

    if (siteName !== undefined) settings.siteName = siteName;
    if (primaryColor !== undefined) settings.primaryColor = primaryColor;

    await settings.save();
    res.status(200).json({ settings });
  } catch (err) {
    console.error('Update settings error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    const settings = await SiteSettings.getSingleton();
    const result = await uploadBufferToCloudinary(req.file.buffer, 'smartcart/branding');
    settings.logoUrl = result.secure_url;
    await settings.save();
    res.status(200).json({ settings });
  } catch (err) {
    console.error('Upload logo error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSettings, updateSettings, uploadLogo };