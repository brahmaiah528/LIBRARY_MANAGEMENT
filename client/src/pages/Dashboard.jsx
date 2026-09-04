import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { ActivityChart, CategoryChart } from '../components/ChartComponents';
import {
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  PlusCircle,
  Repeat,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/dashboard/stats');
      if (res.success) {
        setStats(res.stats);
        setRecentActivity(res.recentActivity);
        setCategoryBreakdown(res.categoryBreakdown);
        setMonthlyTrends(res.monthlyTrends);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={36} className="animate-spin" color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #3730a3 100%)',
          color: '#ffffff',
          marginBottom: '2rem',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Sparkles size={16} /> Welcome back to the portal
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>
            Hello, {user?.name}!
          </h2>
          <p style={{ fontSize: '0.9375rem', opacity: 0.85, marginTop: '0.5rem', maxWidth: '600px' }}>
            {isAdmin
              ? 'Here is an overview of catalog holdings, active circulation, overdue items, and student stats.'
              : 'Track your borrowed books, due dates, reservation requests, and account status.'}
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button onClick={() => navigate('/books')} className="btn btn-secondary btn-sm" style={{ fontWeight: 700 }}>
              <BookOpen size={16} /> Browse Catalog
            </button>
            <button onClick={() => navigate('/issues')} className="btn btn-secondary btn-sm" style={{ fontWeight: 700 }}>
              <Repeat size={16} /> {isAdmin ? 'Issue / Return Book' : 'My Borrowings'}
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid-stats">
        <StatCard
          title="Total Books in Library"
          value={stats?.totalBooks || 0}
          icon={BookOpen}
          color="#6366f1"
          subtext="Catalog Titles"
        />
        {isAdmin && (
          <StatCard
            title="Total Registered Students"
            value={stats?.totalStudents || 0}
            icon={Users}
            color="#3b82f6"
            subtext="Active Academic Users"
          />
        )}
        <StatCard
          title="Books Currently Issued"
          value={stats?.totalIssued || 0}
          icon={Clock}
          color="#f59e0b"
          subtext="Active Circulation"
        />
        <StatCard
          title="Books Successfully Returned"
          value={stats?.totalReturned || 0}
          icon={CheckCircle2}
          color="#10b981"
          subtext="Historical Returns"
        />
        <StatCard
          title="Overdue Books Alert"
          value={stats?.overdueBooks || 0}
          icon={AlertTriangle}
          color="#ef4444"
          subtext="Requires Immediate Action"
        />
      </div>

      {/* Charts Section */}
      <div className="grid-two-col" style={{ marginBottom: '2rem' }}>
        <ActivityChart monthlyTrends={monthlyTrends} />
        <CategoryChart categories={categoryBreakdown} />
      </div>

      {/* Recent Activity Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Recent Circulation Feed</h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Latest issue and return transactions</span>
          </div>
          <button onClick={() => navigate('/issues')} className="btn btn-outline btn-sm">
            View All Issues <ArrowUpRight size={16} />
          </button>
        </div>

        {recentActivity.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No recent activity records found.</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Student / Borrower</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item) => {
                  const isOverdue = item.status === 'Issued' && new Date() > new Date(item.dueDate);
                  return (
                    <tr key={item._id}>
                      <td style={{ fontWeight: 600 }}>{item.book?.title || 'Unknown Book'}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>{item.student?.name || 'N/A'}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.student?.registerNumber}</span>
                        </div>
                      </td>
                      <td>{new Date(item.issueDate).toLocaleDateString()}</td>
                      <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                      <td>
                        {item.status === 'Returned' ? (
                          <span className="badge badge-success">Returned</span>
                        ) : isOverdue ? (
                          <span className="badge badge-danger">Overdue</span>
                        ) : (
                          <span className="badge badge-warning">Issued</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
