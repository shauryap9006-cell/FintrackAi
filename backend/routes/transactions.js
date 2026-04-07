const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  addTransaction,
  getTransactions,
  deleteTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

// POST /api/transactions/add
router.post(
  '/add',
  protect,
  [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense')
  ],
  addTransaction
);

// GET /api/transactions
router.get('/', protect, getTransactions);

// DELETE /api/transactions/:id
router.delete('/:id', protect, deleteTransaction);

module.exports = router;
