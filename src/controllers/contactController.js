const ContactMessage = require('../models/ContactMessage');

// Customer: submit a new message
const createMessage = async (req, res) => {
  try {
    const { subject, message, productId } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const contactMessage = await ContactMessage.create({
      userId: req.user._id,
      productId: productId || null,
      subject,
      message,
    });

    res.status(201).json({ contactMessage });
  } catch (err) {
    console.error('Create message error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Customer: view their own message thread
const getMyMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({ userId: req.user._id })
      .populate('productId', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json({ messages });
  } catch (err) {
    console.error('Get my messages error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: view all messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .populate('userId', 'name email')
      .populate('productId', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json({ messages });
  } catch (err) {
    console.error('Get all messages error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: respond to a message
const respondToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminResponse } = req.body;

    if (!adminResponse) {
      return res.status(400).json({ message: 'adminResponse is required' });
    }

    const contactMessage = await ContactMessage.findByIdAndUpdate(
      id,
      { adminResponse, status: 'responded', respondedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email').populate('productId', 'name images');

    if (!contactMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ contactMessage });
  } catch (err) {
    console.error('Respond to message error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: close a message thread
const closeMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const contactMessage = await ContactMessage.findByIdAndUpdate(id, { status: 'closed' }, { new: true });
    if (!contactMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({ contactMessage });
  } catch (err) {
    console.error('Close message error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createMessage, getMyMessages, getAllMessages, respondToMessage, closeMessage };