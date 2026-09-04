import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  GraduationCap,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Loader2,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
  UserCheck,
  BookOpen,
} from 'lucide-react';
import Modal from '../components/Modal';

const Login = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all credentials');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@library.com');
    setPassword('Admin@123');
    setError('');
  };

  const fillDemoStudent = () => {
    setEmail('student@library.com');
    setPassword('Student@123');
    setError('');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSuccess(true);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        backgroundColor: 'var(--bg-main)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Bar Dark Mode Toggle */}
      <button
        onClick={toggleTheme}
        title="Toggle Theme"
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 50,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          padding: '0.625rem',
          borderRadius: '50%',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {theme === 'dark' ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} color="#4f46e5" />}
      </button>

      {/* Left Branding Showcase Panel (Desktop) */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          color: '#ffffff',
          padding: '4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="hide-mobile"
      >
        {/* Background Decorative Rings */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-20%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* University Logo Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 10 }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            <GraduationCap size={32} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              Apex University
            </h2>
            <span style={{ fontSize: '0.875rem', color: '#a5b4fc' }}>Central Library Operating System</span>
          </div>
        </div>

        {/* Hero Illustration Content */}
        <div style={{ zIndex: 10, maxWidth: '520px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.875rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(165, 180, 252, 0.3)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#c7d2fe',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={14} color="#a5b4fc" /> Smart Academic Resource Portal
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', color: '#ffffff' }}>
            Empowering Digital Discovery & Knowledge Sharing.
          </h1>
          <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem' }}>
            Access thousands of academic textbooks, research publications, automated book issuing, fine tracking, and interactive reports seamlessly.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <BookOpen size={24} color="#818cf8" style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ color: '#fff', fontSize: '1rem' }}>10,000+ Titles</h4>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Categorized & shelf tracked</span>
            </div>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <ShieldCheck size={24} color="#34d399" style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ color: '#fff', fontSize: '1rem' }}>JWT Secured</h4>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Role-based authorization</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ zIndex: 10, fontSize: '0.8125rem', color: '#64748b' }}>
          © 2026 Apex University Library Services. All rights reserved.
        </div>
      </div>

      {/* Right Login Form Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-card)',
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
            Sign in to access your library dashboard and catalog.
          </p>
        </div>

        {/* Demo Credentials Helper Buttons */}
        <div
          style={{
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em' }}>
            Quick Demo Login Fill
          </span>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={fillDemoAdmin} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              <ShieldCheck size={14} color="var(--primary)" /> Fill Admin
            </button>
            <button type="button" onClick={fillDemoStudent} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              <UserCheck size={14} color="var(--success)" /> Fill Student
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div
            style={{
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              border: '1px solid var(--danger)',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Username</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                className="form-input"
                placeholder="e.g. admin@library.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ borderRadius: '4px', accentColor: 'var(--primary)' }}
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In to Portal'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
            Register New Student Account
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => {
          setForgotModalOpen(false);
          setForgotSuccess(false);
        }}
        title="Reset Account Password"
      >
        {forgotSuccess ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <ShieldCheck size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Instructions Dispatched!</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              If an account associated with <strong>{forgotEmail}</strong> exists, password recovery instructions have been sent.
            </p>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Enter your registered academic email address to receive password reset link.
            </p>
            <div className="form-group">
              <label className="form-label">Registered Email</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="student@library.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Send Reset Request
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Login;
