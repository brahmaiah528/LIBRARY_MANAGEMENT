const IssuedBook = require('../models/IssuedBook');
const Book = require('../models/Book');
const User = require('../models/User');

const FINE_PER_DAY = parseInt(process.env.FINE_PER_DAY || '5', 10);

// @desc    Issue a book to a student
// @route   POST /api/issues
// @access  Private/Admin
const issueBook = async (req, res, next) => {
  try {
    const { studentId, bookId, dueDate, remarks } = req.body;

    if (!studentId || !bookId) {
      return res.status(400).json({ success: false, message: 'Student and Book selection are required' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.availableCopies < 1) {
      return res.status(400).json({ success: false, message: 'No copies of this book are currently available' });
    }

    // Default due date to 14 days from now if not specified
    const calculatedDueDate = dueDate
      ? new Date(dueDate)
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const issueRecord = await IssuedBook.create({
      book: book._id,
      student: student._id,
      issueDate: new Date(),
      dueDate: calculatedDueDate,
      status: 'Issued',
      remarks: remarks || '',
    });

    // Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    const populatedRecord = await IssuedBook.findById(issueRecord._id)
      .populate('book', 'title author isbn category shelfNumber')
      .populate('student', 'name email registerNumber department phone');

    res.status(201).json({
      success: true,
      message: 'Book issued successfully',
      issue: populatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Return an issued book
// @route   PUT /api/issues/:id/return
// @access  Private/Admin
const returnBook = async (req, res, next) => {
  try {
    const issueRecord = await IssuedBook.findById(req.params.id);
    if (!issueRecord) {
      return res.status(404).json({ success: false, message: 'Issue record not found' });
    }

    if (issueRecord.status === 'Returned') {
      return res.status(400).json({ success: false, message: 'Book has already been returned' });
    }

    const returnDate = new Date();
    let fine = 0;

    // Calculate fine if returned after due date
    if (returnDate > issueRecord.dueDate) {
      const diffTime = Math.abs(returnDate - issueRecord.dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * FINE_PER_DAY;
    }

    issueRecord.returnDate = returnDate;
    issueRecord.fine = fine;
    issueRecord.status = 'Returned';
    await issueRecord.save();

    // Increment available copies of the book
    const book = await Book.findById(issueRecord.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    const populatedRecord = await IssuedBook.findById(issueRecord._id)
      .populate('book', 'title author isbn category shelfNumber')
      .populate('student', 'name email registerNumber department phone');

    res.json({
      success: true,
      message: 'Book returned successfully',
      fine,
      issue: populatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all issue records (with filters)
// @route   GET /api/issues
// @access  Private
const getIssues = async (req, res, next) => {
  try {
    const { status, studentId, search } = req.query;
    let query = {};

    // If student role, automatically restrict to their own records
    if (req.user.role === 'Student') {
      query.student = req.user._id;
    } else if (studentId) {
      query.student = studentId;
    }

    const now = new Date();

    if (status === 'Issued') {
      query.status = 'Issued';
      query.dueDate = { $gte: now };
    } else if (status === 'Overdue') {
      query.status = 'Issued';
      query.dueDate = { $lt: now };
    } else if (status === 'Returned') {
      query.status = 'Returned';
    }

    const issues = await IssuedBook.find(query)
      .populate('book', 'title author isbn category shelfNumber availableCopies quantity')
      .populate('student', 'name email registerNumber department phone')
      .sort({ createdAt: -1 });

    // Filter by search if provided
    let filteredIssues = issues;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredIssues = issues.filter((item) => {
        const titleMatch = item.book?.title?.toLowerCase().includes(searchLower);
        const studentMatch = item.student?.name?.toLowerCase().includes(searchLower);
        const regMatch = item.student?.registerNumber?.toLowerCase().includes(searchLower);
        const isbnMatch = item.book?.isbn?.toLowerCase().includes(searchLower);
        return titleMatch || studentMatch || regMatch || isbnMatch;
      });
    }

    // Dynamically update calculated fine for overdue issued items
    const processedIssues = filteredIssues.map((item) => {
      const doc = item.toObject();
      if (doc.status === 'Issued' && new Date() > new Date(doc.dueDate)) {
        const diffTime = Math.abs(new Date() - new Date(doc.dueDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        doc.calculatedFine = diffDays * FINE_PER_DAY;
      } else {
        doc.calculatedFine = doc.fine || 0;
      }
      return doc;
    });

    res.json({
      success: true,
      count: processedIssues.length,
      issues: processedIssues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Student self-borrows a book
// @route   POST /api/issues/borrow
// @access  Private (Student or Admin)
const studentBorrowBook = async (req, res, next) => {
  try {
    const { bookId, dueDate, remarks } = req.body;

    if (!bookId) {
      return res.status(400).json({ success: false, message: 'Book selection is required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.availableCopies < 1) {
      return res.status(400).json({ success: false, message: 'No copies of this book are currently available' });
    }

    // Check if student already has this book borrowed (not returned)
    const existing = await IssuedBook.findOne({
      book: book._id,
      student: req.user._id,
      status: 'Issued',
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have this book borrowed' });
    }

    const calculatedDueDate = dueDate
      ? new Date(dueDate)
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const issueRecord = await IssuedBook.create({
      book: book._id,
      student: req.user._id,
      issueDate: new Date(),
      dueDate: calculatedDueDate,
      status: 'Issued',
      remarks: remarks || 'Self-borrowed by student',
    });

    book.availableCopies -= 1;
    await book.save();

    const populatedRecord = await IssuedBook.findById(issueRecord._id)
      .populate('book', 'title author isbn category shelfNumber')
      .populate('student', 'name email registerNumber department phone');

    res.status(201).json({
      success: true,
      message: `"${book.title}" borrowed successfully! Due back by ${calculatedDueDate.toLocaleDateString()}.`,
      issue: populatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Student self-returns a borrowed book
// @route   PUT /api/issues/:id/student-return
// @access  Private (Student — own records only)
const studentReturnBook = async (req, res, next) => {
  try {
    const issueRecord = await IssuedBook.findById(req.params.id);
    if (!issueRecord) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }

    // Ensure student can only return their own borrowed book
    if (issueRecord.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only return books you have borrowed' });
    }

    if (issueRecord.status === 'Returned') {
      return res.status(400).json({ success: false, message: 'This book has already been returned' });
    }

    const returnDate = new Date();
    let fine = 0;

    if (returnDate > issueRecord.dueDate) {
      const diffTime = Math.abs(returnDate - issueRecord.dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * FINE_PER_DAY;
    }

    issueRecord.returnDate = returnDate;
    issueRecord.fine = fine;
    issueRecord.status = 'Returned';
    await issueRecord.save();

    const book = await Book.findById(issueRecord.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    const populatedRecord = await IssuedBook.findById(issueRecord._id)
      .populate('book', 'title author isbn category shelfNumber')
      .populate('student', 'name email registerNumber department phone');

    res.json({
      success: true,
      message: `Book returned successfully!${fine > 0 ? ` Overdue fine: $${fine}.` : ' No overdue fine.'}`,
      fine,
      issue: populatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  issueBook,
  returnBook,
  getIssues,
  studentBorrowBook,
  studentReturnBook,
};
