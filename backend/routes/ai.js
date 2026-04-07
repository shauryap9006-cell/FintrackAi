const express = require('express');
const router = express.Router();
const { getAdvice } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// POST /api/ai/advice
router.post('/advice', protect, getAdvice);

module.exports = router;
