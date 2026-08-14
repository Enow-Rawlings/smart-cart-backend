require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');

const categories = [
  { name: 'electronics' },
  { name: 'fashion' },
  { name: 'home & living' },
  { name: 'beauty' },
  { name: 'sports' },
  { name: 'kitchen' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Category.insertMany(categories);
    console.log(`Inserted ${result.length} categories`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();