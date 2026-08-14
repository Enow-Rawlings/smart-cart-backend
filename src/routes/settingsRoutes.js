const express = require('express');
const { getSettings, updateSettings, uploadLogo } = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getSettings); // public — every page needs this to render branding
router.put('/', protect, adminOnly, updateSettings);
router.post('/logo', protect, adminOnly, upload.single('file'), uploadLogo);

module.exports = router;