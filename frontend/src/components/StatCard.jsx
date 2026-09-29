import React from 'react';

export default function StatCard({ title, value, icon: Icon, color, trend }) {
  return (
    <div className="scrapex-card hoverable h-100 mb-0">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="text-secondary fw-semibold" style={{ fontSize: '0.875rem' }}>{title}</span>
        <div 
          className="rounded-3 d-flex align-items-center justify-content-center" 
          style={{ width: 42, height: 42, backgroundColor: color ? `${color}15` : 'rgba(79, 70, 229, 0.1)', color: color || '#4f46e5' }}
        >
          {Icon && <Icon size={20} />}
        </div>
      </div>
      <div className="stat-card-val">{value !== undefined ? value.toLocaleString() : '0'}</div>
      {trend && (
        <div className="mt-2 text-xs d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.8rem' }}>
          <span className="text-success fw-medium">{trend}</span> vs last period
        </div>
      )}
    </div>
  );
}
