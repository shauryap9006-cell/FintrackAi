const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const transactionRoutes = require('./routes/transactions');
const analyticsRoutes = require('./routes/analytics');
const aiRoutes = require('./routes/ai');
const paymentRoutes = require('./routes/payments');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);

// Requested placeholder for step validation
app.get("/api", (req, res) => {
  res.json({ message: "API working" });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

module.exports = app;
