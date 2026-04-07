const Transaction = require('../models/Transaction');

// GET /api/analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Monthly spending grouped by month
    const monthlySpending = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    // Category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Income vs Expense totals
    const totals = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const income = totals.find((t) => t._id === 'income')?.total || 0;
    const expense = totals.find((t) => t._id === 'expense')?.total || 0;

    // Format monthly spending
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const formattedMonthly = monthlySpending.map((item) => ({
      month: `${months[item._id.month - 1]} ${item._id.year}`,
      amount: item.total,
    }));

    res.status(200).json({
      success: true,
      data: {
        monthlySpending: formattedMonthly,
        categoryBreakdown: categoryBreakdown.map((item) => ({
          category: item._id,
          total: item.total,
          count: item.count,
        })),
        totals: {
          income,
          expense,
          balance: income - expense,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
