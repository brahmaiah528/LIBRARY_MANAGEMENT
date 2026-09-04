import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import Modal from '../components/Modal';
import NotificationToast from '../components/NotificationToast';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  History,
  Mail,
  Phone,
  GraduationCap,
  Loader2,
  BookOpen,
} from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add/Edit Student Modal
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // History Modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science & Engineering',
    registerNumber: '',
    role: 'Student',
    password: '',
  });

  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      queryParams.append('role', 'Student');

      const res = await apiFetch(`/users?${queryParams.toString()}`);
      if (res.success) {
        setStudents(res.users);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to fetch students' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [searchTerm]);

  const openAddModal = () => {
    setEditMode(false);
    setSelectedStudentId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: 'Computer Science & Engineering',
      registerNumber: `CS-2026-${Math.floor(100 + Math.random() * 900)}`,
      role: 'Student',
      password: 'Student@123',
    });
    setStudentModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditMode(true);
    setSelectedStudentId(student._id);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone || '',
      department: student.department || 'Computer Science & Engineering',
      registerNumber: student.registerNumber || '',
      role: student.role,
      password: '',
    });
    setStudentModalOpen(true);
  };

  const openHistoryModal = async (student) => {
    setSelectedStudent(student);
    setHistoryModalOpen(true);
    setHistoryLoading(true);
    try {
      const res = await apiFetch(`/users/${student._id}`);
      if (res.success) {
        setHistory(res.history || []);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to fetch history' });
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editMode) {
        const res = await apiFetch(`/users/${selectedStudentId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        if (res.success) {
          setToast({ type: 'success', message: 'Student information updated' });
        }
      } else {
        const res = await apiFetch('/users', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        if (res.success) {
          setToast({ type: 'success', message: 'Student registered successfully' });
        }
      }
      setStudentModalOpen(false);
      fetchStudents();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove student "${name}"?`)) return;

    try {
      const res = await apiFetch(`/users/${id}`, { method: 'DELETE' });
      if (res.success) {
        setToast({ type: 'success', message: 'Student removed successfully' });
        fetchStudents();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete student' });
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>Student Directory</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Manage student accounts, registration details, and borrowing history.</span>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} /> Register New Student
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by Name, Reg Number, Department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 size={36} className="animate-spin" color="var(--primary)" />
        </div>
      ) : students.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Users size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Students Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>No student records match your query.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student Name & Reg No</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Department</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                        }}
                      >
                        {student.name.charAt(0)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{student.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {student.registerNumber || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{student.email}</td>
                  <td>{student.phone || 'N/A'}</td>
                  <td>
                    <span className="badge badge-info">{student.department || 'General'}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => openHistoryModal(student)} className="btn btn-outline btn-sm" title="Borrowing History">
                        <History size={16} /> History
                      </button>
                      <button onClick={() => openEditModal(student)} className="btn btn-secondary btn-sm" title="Edit Student">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(student._id, student.name)} className="btn btn-danger btn-sm" title="Delete Student">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        title={editMode ? 'Edit Student Details' : 'Register New Student'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                required
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-input"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Register Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.registerNumber}
                onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
              />
            </div>
          </div>

          {!editMode && (
            <div className="form-group">
              <label className="form-label">Default Password</label>
              <input
                type="password"
                required
                className="form-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setStudentModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : editMode ? 'Save Changes' : 'Register Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Borrowing History Modal */}
      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={`Borrowing History: ${selectedStudent?.name || ''}`}
      >
        {historyLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader2 size={28} className="animate-spin" color="var(--primary)" />
          </div>
        ) : history.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            This student has no borrowing history records.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
            {history.map((record) => (
              <div
                key={record._id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{record.book?.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Issued: {new Date(record.issueDate).toLocaleDateString()} | Due: {new Date(record.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  {record.status === 'Returned' ? (
                    <span className="badge badge-success">Returned</span>
                  ) : (
                    <span className="badge badge-warning">Active Issue</span>
                  )}
                  {record.fine > 0 && <div style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 700 }}>Fine: ${record.fine}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <NotificationToast notification={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default Students;
