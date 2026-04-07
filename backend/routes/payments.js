const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// POST /api/payments/create-order
router.post('/create-order', protect, createOrder);

// POST /api/payments/verify
router.post('/verify', protect, verifyPayment);

module.exports = router;
