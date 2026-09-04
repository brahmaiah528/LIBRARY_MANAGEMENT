import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const NotificationToast = ({ notification, onClose }) => {
  if (!notification) return null;

  const { type, message } = notification;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: isSuccess
          ? 'var(--success)'
          : isError
          ? 'var(--danger)'
          : 'var(--primary)',
        color: '#ffffff',
        boxShadow: 'var(--shadow-lg)',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        maxWidth: '420px',
      }}
    >
      {isSuccess && <CheckCircle2 size={20} />}
      {isError && <AlertCircle size={20} />}
      {!isSuccess && !isError && <Info size={20} />}
      <span style={{ fontSize: '0.875rem', fontWeight: 600, flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default NotificationToast;
