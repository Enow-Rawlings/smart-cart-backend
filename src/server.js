require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const featuredRoutes = require('./routes/featuredRoutes');
const contactRoutes = require('./routes/contactRoutes');

connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://smart-cart-frontend-rho.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
const normalizePort = (value) => {
  const port = parseInt(value, 10);
  return Number.isInteger(port) && port > 0 ? port : null;
};

const requestedPort = normalizePort(process.env.PORT) || 5000;

app.use(express.json());
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use('/api/analytics', analyticsRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartCart API is running' });
});

app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);

app.use('/api/cart', cartRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/recommendations', recommendationRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/promotions', promotionRoutes);

app.use('/api/settings', settingsRoutes);

app.use('/api/wishlist', wishlistRoutes);

app.use('/api/currency', currencyRoutes);

app.use('/api/featured', featuredRoutes);

app.use('/api/contact', contactRoutes);

// New routes added for v2 features
const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

const startServer = (port, attemptsLeft = 10) => {
  const server = app.listen(port, () => {
    console.log(`SmartCart API listening on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attemptsLeft > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy. Retrying on ${nextPort}...`);
      startServer(nextPort, attemptsLeft - 1);
      return;
    }

    console.error('Failed to start server:', error);
    process.exit(1);
  });
};

startServer(requestedPort);