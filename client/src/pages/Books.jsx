import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import NotificationToast from '../components/NotificationToast';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Bookmark,
  BookMarked,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Books = () => {
  const { isAdmin, isStudent } = useAuth();
  const [searchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  // Admin: Add/Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  // Student: Borrow Modal State
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [borrowBook, setBorrowBook] = useState(null);
  const [borrowDueDate, setBorrowDueDate] = useState('');
  const [borrowSubmitting, setBorrowSubmitting] = useState(false);

  // Form State (Admin)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    category: 'Computer Science',
    quantity: 5,
    shelfNumber: 'A-1',
  });

  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (selectedCategory && selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (availabilityFilter !== 'all') queryParams.append('availability', availabilityFilter);

      const res = await apiFetch(`/books?${queryParams.toString()}`);
      if (res.success) {
        setBooks(res.books);
        if (res.categories) setCategories(res.categories);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to load books' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, selectedCategory, availabilityFilter]);

  // ── Admin: Add / Edit ──────────────────────────────────────────────
  const openAddModal = () => {
    setEditMode(false);
    setSelectedBookId(null);
    setFormData({
      title: '',
      author: '',
      isbn: `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
      publisher: '',
      category: 'Computer Science',
      quantity: 5,
      shelfNumber: 'CS-101',
    });
    setModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditMode(true);
    setSelectedBookId(book._id);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher || '',
      category: book.category,
      quantity: book.quantity,
      shelfNumber: book.shelfNumber || 'A-1',
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editMode) {
        const res = await apiFetch(`/books/${selectedBookId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        if (res.success) {
          setToast({ type: 'success', message: 'Book details updated successfully' });
        }
      } else {
        const res = await apiFetch('/books', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        if (res.success) {
          setToast({ type: 'success', message: 'New book added to library catalog' });
        }
      }
      setModalOpen(false);
      fetchBooks();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await apiFetch(`/books/${id}`, { method: 'DELETE' });
      if (res.success) {
        setToast({ type: 'success', message: 'Book deleted successfully' });
        fetchBooks();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete book' });
    }
  };

  // ── Student: Borrow ────────────────────────────────────────────────
  const openBorrowModal = (book) => {
    setBorrowBook(book);
    const defaultDue = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setBorrowDueDate(defaultDue);
    setBorrowModalOpen(true);
  };

  const handleBorrowConfirm = async () => {
    if (!borrowBook) return;
    setBorrowSubmitting(true);
    try {
      const res = await apiFetch('/issues/borrow', {
        method: 'POST',
        body: JSON.stringify({ bookId: borrowBook._id, dueDate: borrowDueDate }),
      });
      if (res.success) {
        setToast({ type: 'success', message: res.message || 'Book borrowed successfully!' });
        setBorrowModalOpen(false);
        fetchBooks();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to borrow book' });
    } finally {
      setBorrowSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>Book Catalog</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {isAdmin ? 'Search, add, edit, and organize library book holdings.' : 'Browse available books and borrow them directly.'}
          </span>
        </div>
        {isAdmin && (
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={18} /> Add New Book
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search Title, Author, ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <div>
            <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <select className="form-select" value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
              <option value="all">All Availability Statuses</option>
              <option value="available">Available Copies (&gt;0)</option>
              <option value="unavailable">Out of Stock (0 Copies)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 size={36} className="animate-spin" color="var(--primary)" />
        </div>
      ) : books.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Bookmark size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Books Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria or add new books.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title &amp; Author</th>
                <th>Category</th>
                <th>ISBN</th>
                <th>Shelf</th>
                <th>Copies (Avail / Total)</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => {
                const isAvailable = book.availableCopies > 0;
                return (
                  <tr key={book._id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{book.title}</span>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>by {book.author}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{book.category}</span></td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{book.isbn}</td>
                    <td><span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{book.shelfNumber || 'N/A'}</span></td>
                    <td><span style={{ fontWeight: 700 }}>{book.availableCopies}</span> / {book.quantity}</td>
                    <td>
                      {isAvailable ? (
                        <span className="badge badge-success">Available</span>
                      ) : (
                        <span className="badge badge-danger">Out of Stock</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {/* Student: Borrow button */}
                        {isStudent && isAvailable && (
                          <button
                            onClick={() => openBorrowModal(book)}
                            className="btn btn-primary btn-sm"
                            title="Borrow this book"
                          >
                            <BookMarked size={16} /> Borrow
                          </button>
                        )}
                        {isStudent && !isAvailable && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not available</span>
                        )}
                        {/* Admin: Edit / Delete buttons */}
                        {isAdmin && (
                          <>
                            <button onClick={() => openEditModal(book)} className="btn btn-secondary btn-sm" title="Edit Book">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(book._id, book.title)} className="btn btn-danger btn-sm" title="Delete Book">
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Admin: Add / Edit Book Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editMode ? 'Edit Book Information' : 'Add New Book to Catalog'}>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">Book Title</label>
            <input type="text" required className="form-input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Author Name</label>
              <input type="text" required className="form-input" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">ISBN Code</label>
              <input type="text" required className="form-input" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Publisher</label>
              <input type="text" className="form-input" value={formData.publisher} onChange={(e) => setFormData({ ...formData, publisher: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input type="text" required className="form-input" placeholder="e.g. Computer Science" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Total Copies Quantity</label>
              <input type="number" min="1" required className="form-input" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Shelf Number Location</label>
              <input type="text" className="form-input" placeholder="e.g. CS-102" value={formData.shelfNumber} onChange={(e) => setFormData({ ...formData, shelfNumber: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : editMode ? 'Save Changes' : 'Add Book'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Student: Borrow Confirmation Modal */}
      <Modal isOpen={borrowModalOpen} onClose={() => setBorrowModalOpen(false)} title="Borrow Book">
        <div style={{ padding: '0.5rem 0' }}>
          {/* Book Info Card */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            marginBottom: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <BookMarked size={28} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>{borrowBook?.title}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>by {borrowBook?.author}</p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-primary">{borrowBook?.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shelf: {borrowBook?.shelfNumber}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
                    {borrowBook?.availableCopies} copies available
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label className="form-label">Return Due Date</label>
            <input
              type="date"
              className="form-input"
              value={borrowDueDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setBorrowDueDate(e.target.value)}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Default: 14 days from today. Late returns incur a $5/day overdue fine.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setBorrowModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="button" onClick={handleBorrowConfirm} disabled={borrowSubmitting} className="btn btn-primary">
              {borrowSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><BookMarked size={16} /> Confirm Borrow</>}
            </button>
          </div>
        </div>
      </Modal>

      <NotificationToast notification={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default Books;
