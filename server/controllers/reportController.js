const IssuedBook = require('../models/IssuedBook');
const Book = require('../models/Book');

// @desc    Get detailed reports dataset
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res, next) => {
  try {
    const isStudent = req.user.role === 'Student';
    const studentFilter = isStudent ? { student: req.user._id } : {};

    // 1. All issued books
    const issuedBooks = await IssuedBook.find({ ...studentFilter, status: 'Issued' })
      .populate('book', 'title author isbn category shelfNumber')
      .populate('student', 'name email registerNumber department phone')
      .sort({ issueDate: -1 });

    // 2. All returned books
    const returnedBooks = await IssuedBook.find({ ...studentFilter, status: 'Returned' })
      .populate('book', 'title author isbn category shelfNumber')
      .populate('student', 'name email registerNumber department phone')
      .sort({ returnDate: -1 });

    // 3. Overdue books
    const now = new Date();
    const overdueBooks = await IssuedBook.find({
      ...studentFilter,
      status: 'Issued',
      dueDate: { $lt: now },
    })
      .populate('book', 'title author isbn category shelfNumber')
      .populate('student', 'name email registerNumber department phone')
      .sort({ dueDate: 1 });

    // 4. Most borrowed books ranking
    const topBorrowedAgg = await IssuedBook.aggregate([
      ...(isStudent ? [{ $match: { student: req.user._id } }] : []),
      { $group: { _id: '$book', timesBorrowed: { $sum: 1 } } },
      { $sort: { timesBorrowed: -1 } },
      { $limit: 10 },
    ]);

    const populatedTopBorrowed = await Promise.all(
      topBorrowedAgg.map(async (item) => {
        const bookDetails = await Book.findById(item._id).select('title author isbn category quantity availableCopies');
        return {
          book: bookDetails,
          timesBorrowed: item.timesBorrowed,
        };
      })
    );

    res.json({
      success: true,
      reports: {
        issued: issuedBooks,
        returned: returnedBooks,
        overdue: overdueBooks,
        topBorrowed: populatedTopBorrowed.filter((item) => item.book !== null),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReports,
};
