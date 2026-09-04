import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import NotificationToast from '../components/NotificationToast';
import {
  Repeat,
  Search,
  Plus,
  RotateCcw,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  Loader2,
  BookOpen,
  UserCheck,
} from 'lucide-react';

const IssueReturn = () => {
  const { isAdmin, isStudent, user } = useAuth();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Dropdown lists for Issue Modal
  const [booksList, setBooksList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);

  // Issue Book Modal State
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueForm, setIssueForm] = useState({
    studentId: '',
    bookId: '',
    dueDate: '',
    remarks: '',
  });

  // Return Book Modal State
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [calculatedFine, setCalculatedFine] = useState(0);

  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'All') queryParams.append('status', statusFilter);
      if (searchTerm) queryParams.append('search', searchTerm);

      const res = await apiFetch(`/issues?${queryParams.toString()}`);
      if (res.success) {
        setIssues(res.issues);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to load issue records' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [statusFilter, searchTerm]);

  // Load books & students when opening Issue Modal
  const openIssueModal = async () => {
    try {
      const [booksRes, studentsRes] = await Promise.all([
        apiFetch('/books?availability=available'),
        apiFetch('/users?role=Student'),
      ]);

      if (booksRes.success) setBooksList(booksRes.books || []);
      if (studentsRes.success) setStudentsList(studentsRes.users || []);

      // Default due date to +14 days
      const defaultDue = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      setIssueForm({
        studentId: studentsRes.users?.[0]?._id || '',
        bookId: booksRes.books?.[0]?._id || '',
        dueDate: defaultDue,
        remarks: 'Issued for general study',
      });

      setIssueModalOpen(true);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load options for issuing' });
    }
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiFetch('/issues', {
        method: 'POST',
        body: JSON.stringify(issueForm),
      });

      if (res.success) {
        setToast({ type: 'success', message: 'Book issued successfully to student' });
        setIssueModalOpen(false);
        fetchIssues();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Issue operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const openReturnModal = (record) => {
    setSelectedRecord(record);

    // Compute live fine
    let fine = 0;
    const now = new Date();
    const due = new Date(record.dueDate);
    if (now > due) {
      const diffTime = Math.abs(now - due);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * 5; // $5 per day fine rate
    }

    setCalculatedFine(fine);
    setReturnModalOpen(true);
  };

  const handleReturnConfirm = async () => {
    if (!selectedRecord) return;
    setSubmitting(true);
    try {
      // Admin uses /return, Student uses /student-return
      const endpoint = isAdmin
        ? `/issues/${selectedRecord._id}/return`
        : `/issues/${selectedRecord._id}/student-return`;

      const res = await apiFetch(endpoint, { method: 'PUT' });

      if (res.success) {
        setToast({
          type: 'success',
          message: `Book returned! ${res.fine > 0 ? `Overdue fine: $${res.fine}` : 'No overdue fine.'}`,
        });
        setReturnModalOpen(false);
        fetchIssues();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Return operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>Issue & Return Desk</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Track active borrowing transactions, due dates, returns, and overdue fine calculations.</span>
        </div>
        {isAdmin && (
          <button onClick={openIssueModal} className="btn btn-primary">
            <Plus size={18} /> Issue New Book
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-main)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            {['All', 'Issued', 'Overdue', 'Returned'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: statusFilter === tab ? 'var(--primary)' : 'transparent',
                  color: statusFilter === tab ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by student name, register number, or book title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 size={36} className="animate-spin" color="var(--primary)" />
        </div>
      ) : issues.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Repeat size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Transactions Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>No active circulation records match your current filter.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Book Details</th>
                <th>Student / Borrower</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Fine Status</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((record) => {
                const isOverdue = record.status === 'Issued' && new Date() > new Date(record.dueDate);
                return (
                  <tr key={record._id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{record.book?.title}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ISBN: {record.book?.isbn} | Shelf: {record.book?.shelfNumber}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{record.student?.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {record.student?.registerNumber}
                        </span>
                      </div>
                    </td>
                    <td>{new Date(record.issueDate).toLocaleDateString()}</td>
                    <td>
                      <span style={{ fontWeight: isOverdue ? 700 : 400, color: isOverdue ? 'var(--danger)' : 'inherit' }}>
                        {new Date(record.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      {record.calculatedFine > 0 ? (
                        <span style={{ fontWeight: 700, color: 'var(--danger)' }}>${record.calculatedFine} overdue fine</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>$0.00</span>
                      )}
                    </td>
                    <td>
                      {record.status === 'Returned' ? (
                        <span className="badge badge-success">Returned</span>
                      ) : isOverdue ? (
                        <span className="badge badge-danger">Overdue</span>
                      ) : (
                        <span className="badge badge-warning">Issued</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {/* Admin: can return any issued book */}
                      {isAdmin && record.status === 'Issued' && (
                        <button onClick={() => openReturnModal(record)} className="btn btn-success btn-sm">
                          <RotateCcw size={16} /> Return Book
                        </button>
                      )}
                      {/* Student: can only return their own issued book */}
                      {isStudent && record.status === 'Issued' && record.student?._id === user?._id && (
                        <button onClick={() => openReturnModal(record)} className="btn btn-success btn-sm">
                          <RotateCcw size={16} /> Return
                        </button>
                      )}
                      {record.status === 'Returned' && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Returned</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Issue Book Modal */}
      <Modal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        title="Issue Book to Student"
      >
        <form onSubmit={handleIssueSubmit}>
          <div className="form-group">
            <label className="form-label">Select Student Borrower</label>
            <select
              className="form-select"
              required
              value={issueForm.studentId}
              onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
            >
              {studentsList.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.name} ({st.registerNumber || st.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Select Available Book</label>
            <select
              className="form-select"
              required
              value={issueForm.bookId}
              onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
            >
              {booksList.map((bk) => (
                <option key={bk._id} value={bk._id}>
                  {bk.title} (Available: {bk.availableCopies})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Return Due Date</label>
            <input
              type="date"
              required
              className="form-input"
              value={issueForm.dueDate}
              onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Remarks / Notes</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Issued for Mid-term Exam prep"
              value={issueForm.remarks}
              onChange={(e) => setIssueForm({ ...issueForm, remarks: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIssueModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Issue'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Return Confirmation Modal */}
      <Modal
        isOpen={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        title="Confirm Book Return"
      >
        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Confirm return for book: <strong>{selectedRecord?.book?.title}</strong> borrowed by <strong>{selectedRecord?.student?.name}</strong>?
          </p>

          {calculatedFine > 0 ? (
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--danger-light)', border: '1px solid var(--danger)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontWeight: 700, marginBottom: '0.25rem' }}>
                <AlertTriangle size={20} /> Overdue Fine Notice
              </div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                This book is returned past its due date ({new Date(selectedRecord?.dueDate).toLocaleDateString()}).
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--danger)', marginTop: '0.5rem' }}>
                Calculated Fine: ${calculatedFine} ($5/day)
              </div>
            </div>
          ) : (
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--success-light)', border: '1px solid var(--success)', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--success)', fontWeight: 700 }}>
                Returned On Time. No Overdue Fine Applicable.
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setReturnModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={handleReturnConfirm} disabled={submitting} className="btn btn-success">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Book Return'}
            </button>
          </div>
        </div>
      </Modal>

      <NotificationToast notification={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default IssueReturn;
