const express = require('express');
const router = express.Router();
const {
  issueBook,
  returnBook,
  getIssues,
  studentBorrowBook,
  studentReturnBook,
} = require('../controllers/issueController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getIssues);
router.post('/', protect, adminOnly, issueBook);
router.put('/:id/return', protect, adminOnly, returnBook);

// Student self-service routes (no admin required)
router.post('/borrow', protect, studentBorrowBook);
router.put('/:id/student-return', protect, studentReturnBook);

module.exports = router;
