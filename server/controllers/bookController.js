const Book = require('../models/Book');

// @desc    Get all books (with search & filters)
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res, next) => {
  try {
    const { search, category, availability } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { isbn: searchRegex },
        { publisher: searchRegex },
        { category: searchRegex },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (availability === 'available') {
      query.availableCopies = { $gt: 0 };
    } else if (availability === 'unavailable') {
      query.availableCopies = { $eq: 0 };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    const categories = await Book.distinct('category');

    res.json({
      success: true,
      count: books.length,
      categories,
      books,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, book });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res, next) => {
  try {
    const { title, author, isbn, publisher, category, quantity, shelfNumber } = req.body;

    if (!title || !author || !isbn || !category || !quantity) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingBook = await Book.findOne({ isbn: isbn.trim() });
    if (existingBook) {
      return res.status(400).json({ success: false, message: 'A book with this ISBN already exists' });
    }

    const parsedQty = parseInt(quantity, 10);

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      publisher: publisher ? publisher.trim() : 'Unknown Publisher',
      category: category.trim(),
      quantity: parsedQty,
      availableCopies: parsedQty,
      shelfNumber: shelfNumber ? shelfNumber.trim() : 'A-1',
    });

    res.status(201).json({ success: true, book });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const { title, author, isbn, publisher, category, quantity, shelfNumber } = req.body;

    if (quantity !== undefined) {
      const newQty = parseInt(quantity, 10);
      const diff = newQty - book.quantity;
      book.quantity = newQty;
      book.availableCopies = Math.max(0, book.availableCopies + diff);
    }

    book.title = title !== undefined ? title.trim() : book.title;
    book.author = author !== undefined ? author.trim() : book.author;
    book.isbn = isbn !== undefined ? isbn.trim() : book.isbn;
    book.publisher = publisher !== undefined ? publisher.trim() : book.publisher;
    book.category = category !== undefined ? category.trim() : book.category;
    book.shelfNumber = shelfNumber !== undefined ? shelfNumber.trim() : book.shelfNumber;

    const updatedBook = await book.save();

    res.json({ success: true, book: updatedBook });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    await book.deleteOne();

    res.json({ success: true, message: 'Book removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
