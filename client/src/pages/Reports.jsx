import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import NotificationToast from '../components/NotificationToast';
import {
  FileBarChart,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Loader2,
  Bookmark,
} from 'lucide-react';

const Reports = () => {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [toast, setToast] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/reports');
      if (res.success) {
        setReportsData(res.reports);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to fetch analytical reports' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!reportsData) return;
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeTab === 'issued') {
      csvContent += 'Book Title,ISBN,Student Name,Reg Number,Issue Date,Due Date\n';
      reportsData.issued.forEach((r) => {
        csvContent += `"${r.book?.title}","${r.book?.isbn}","${r.student?.name}","${r.student?.registerNumber}","${new Date(r.issueDate).toLocaleDateString()}","${new Date(r.dueDate).toLocaleDateString()}"\n`;
      });
    } else if (activeTab === 'returned') {
      csvContent += 'Book Title,ISBN,Student Name,Return Date,Fine Paid\n';
      reportsData.returned.forEach((r) => {
        csvContent += `"${r.book?.title}","${r.book?.isbn}","${r.student?.name}","${new Date(r.returnDate).toLocaleDateString()}","$${r.fine || 0}"\n`;
      });
    } else {
      csvContent += 'Book Title,Author,Times Borrowed\n';
      reportsData.topBorrowed.forEach((r) => {
        csvContent += `"${r.book?.title}","${r.book?.author}","${r.timesBorrowed}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Library_Report_${activeTab}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={36} className="animate-spin" color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>Reports & Analytics</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Monthly summaries, return logs, overdue records, and most borrowed books.</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handlePrint} className="btn btn-secondary">
            <Printer size={18} /> Print Report
          </button>
          <button onClick={handleExportCSV} className="btn btn-primary">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'summary', label: 'Summary Overview', icon: FileBarChart },
            { id: 'issued', label: 'Issued Books Report', icon: Clock },
            { id: 'returned', label: 'Returned Books Report', icon: CheckCircle2 },
            { id: 'overdue', label: 'Overdue List Report', icon: AlertTriangle },
            { id: 'top', label: 'Most Borrowed Books', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.125rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-main)',
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Content Panel */}
      {activeTab === 'summary' && (
        <div className="grid-stats">
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <Clock size={36} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '2.25rem', fontWeight: 800 }}>{reportsData?.issued?.length || 0}</h3>
            <span style={{ color: 'var(--text-secondary)' }}>Currently Active Issues</span>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '2.25rem', fontWeight: 800 }}>{reportsData?.returned?.length || 0}</h3>
            <span style={{ color: 'var(--text-secondary)' }}>Total Completed Returns</span>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <AlertTriangle size={36} color="var(--danger)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '2.25rem', fontWeight: 800 }}>{reportsData?.overdue?.length || 0}</h3>
            <span style={{ color: 'var(--text-secondary)' }}>Current Overdue Items</span>
          </div>
        </div>
      )}

      {activeTab === 'issued' && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Borrower Student</th>
                <th>Issue Date</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {reportsData?.issued.map((row) => (
                <tr key={row._id}>
                  <td style={{ fontWeight: 700 }}>{row.book?.title}</td>
                  <td>{row.student?.name} ({row.student?.registerNumber})</td>
                  <td>{new Date(row.issueDate).toLocaleDateString()}</td>
                  <td>{new Date(row.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'returned' && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Borrower Student</th>
                <th>Return Date</th>
                <th>Fine Paid</th>
              </tr>
            </thead>
            <tbody>
              {reportsData?.returned.map((row) => (
                <tr key={row._id}>
                  <td style={{ fontWeight: 700 }}>{row.book?.title}</td>
                  <td>{row.student?.name}</td>
                  <td>{new Date(row.returnDate).toLocaleDateString()}</td>
                  <td>${row.fine || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'overdue' && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Borrower Student</th>
                <th>Due Date</th>
                <th>Contact Info</th>
              </tr>
            </thead>
            <tbody>
              {reportsData?.overdue.map((row) => (
                <tr key={row._id}>
                  <td style={{ fontWeight: 700, color: 'var(--danger)' }}>{row.book?.title}</td>
                  <td>{row.student?.name} ({row.student?.registerNumber})</td>
                  <td style={{ fontWeight: 700, color: 'var(--danger)' }}>{new Date(row.dueDate).toLocaleDateString()}</td>
                  <td>{row.student?.email} | {row.student?.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'top' && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Times Borrowed</th>
              </tr>
            </thead>
            <tbody>
              {reportsData?.topBorrowed.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>#{idx + 1}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{row.book?.title}</td>
                  <td>{row.book?.author}</td>
                  <td>
                    <span className="badge badge-primary">{row.book?.category}</span>
                  </td>
                  <td style={{ fontWeight: 800 }}>{row.timesBorrowed} times</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <NotificationToast notification={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default Reports;
