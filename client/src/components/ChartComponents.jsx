import React from 'react';

export const ActivityChart = ({ monthlyTrends = [] }) => {
  const maxVal = Math.max(
    ...monthlyTrends.map((t) => Math.max(t.issued || 0, t.returned || 0)),
    5
  );

  return (
    <div className="card" style={{ height: '100%' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>Monthly Lending Activity</h4>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Books issued vs. returned past 6 months</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#6366f1' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Issued</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Returned</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '1rem' }}>
        {monthlyTrends.map((item, idx) => {
          const issuedHeight = (item.issued / maxVal) * 140;
          const returnedHeight = (item.returned / maxVal) * 140;

          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.375rem', height: '140px' }}>
                <div
                  title={`Issued: ${item.issued}`}
                  style={{
                    width: '14px',
                    height: `${Math.max(issuedHeight, 6)}px`,
                    backgroundColor: '#6366f1',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease',
                  }}
                />
                <div
                  title={`Returned: ${item.returned}`}
                  style={{
                    width: '14px',
                    height: `${Math.max(returnedHeight, 6)}px`,
                    backgroundColor: '#10b981',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease',
                  }}
                />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CategoryChart = ({ categories = [] }) => {
  const totalCount = categories.reduce((sum, c) => sum + (c.count || 0), 0) || 1;
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];

  return (
    <div className="card" style={{ height: '100%' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>Category Distribution</h4>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Breakdown by department & genre</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {categories.slice(0, 5).map((cat, idx) => {
          const percentage = Math.round(((cat.count || 0) / totalCount) * 100);
          const color = colors[idx % colors.length];

          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.category}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{cat.count} books ({percentage}%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: color,
                    borderRadius: '9999px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
