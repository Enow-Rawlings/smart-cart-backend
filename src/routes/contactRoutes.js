const express = require('express');
const {
  createMessage, getMyMessages, getAllMessages, respondToMessage, closeMessage,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createMessage);
router.get('/me', getMyMessages);
router.get('/', adminOnly, getAllMessages);
router.put('/:id/respond', adminOnly, respondToMessage);
router.put('/:id/close', adminOnly, closeMessage);

module.exports = router;