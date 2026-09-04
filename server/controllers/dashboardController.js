const Book = require('../models/Book');
const User = require('../models/User');
const IssuedBook = require('../models/IssuedBook');

// @desc    Get aggregated dashboard stats and chart data
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const isStudent = req.user.role === 'Student';
    const studentFilter = isStudent ? { student: req.user._id } : {};

    const totalBooks = await Book.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'Student' });

    const totalIssued = await IssuedBook.countDocuments({
      ...studentFilter,
      status: 'Issued',
    });

    const totalReturned = await IssuedBook.countDocuments({
      ...studentFilter,
      status: 'Returned',
    });

    const now = new Date();
    const overdueBooks = await IssuedBook.countDocuments({
      ...studentFilter,
      status: 'Issued',
      dueDate: { $lt: now },
    });

    // Get recent activity
    const recentActivity = await IssuedBook.find(studentFilter)
      .populate('book', 'title author isbn category')
      .populate('student', 'name email registerNumber department')
      .sort({ createdAt: -1 })
      .limit(6);

    // Books by category breakdown
    const categoryAgg = await Book.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalCopies: { $sum: '$quantity' } } },
      { $sort: { count: -1 } },
    ]);

    // Monthly activity mock/aggregation for charts (past 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrends = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const nextD = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
      const mName = monthNames[d.getMonth()];

      const issuedInMonth = await IssuedBook.countDocuments({
        ...studentFilter,
        createdAt: { $gte: d, $lt: nextD },
      });

      const returnedInMonth = await IssuedBook.countDocuments({
        ...studentFilter,
        returnDate: { $gte: d, $lt: nextD },
      });

      monthlyTrends.push({
        month: mName,
        issued: issuedInMonth,
        returned: returnedInMonth,
      });
    }

    res.json({
      success: true,
      stats: {
        totalBooks,
        totalStudents,
        totalIssued,
        totalReturned,
        overdueBooks,
      },
      recentActivity,
      categoryBreakdown: categoryAgg.map((item) => ({
        category: item._id,
        count: item.count,
        totalCopies: item.totalCopies,
      })),
      monthlyTrends,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
