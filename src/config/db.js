const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri || typeof uri !== 'string') {
      console.error(
        'MongoDB connection failed: missing or invalid MONGODB_URI in environment variables.'
      );
      process.exit(1);
    }

    // Helps catch common mistakes early (e.g., pasting the SRV/host without mongodb://)
    const trimmed = uri.trim();
    if (!trimmed.startsWith('mongodb://') && !trimmed.startsWith('mongodb+srv://')) {
      console.error(
        'MongoDB connection failed: MONGODB_URI must start with "mongodb://" or "mongodb+srv://".'
      );
      process.exit(1);
    }

    await mongoose.connect(trimmed);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // stop the app if we can't connect to the DB
  }
};

module.exports = connectDB;

