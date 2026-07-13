require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const campaignRoutes = require('./src/routes/campaignRoutes');
const contributionRoutes = require('./src/routes/contributionRoutes');
const withdrawalRoutes = require('./src/routes/withdrawalRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow credentials dynamically to support Vercel serverless and local ports
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Root Check Endpoint
app.get('/', (req, res) => {
  res.send('Tree Funding API service is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
