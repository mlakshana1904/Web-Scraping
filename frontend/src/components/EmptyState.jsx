import React from 'react';
import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ title = 'No Data Found', message = 'There are no records to display.', actionLabel, onAction, icon: Icon = FiInbox }) {
  return (
    <div className="text-center py-5 px-3">
      <div className="d-inline-flex align-items-center justify-content-center bg-body-tertiary text-muted rounded-circle mb-3" style={{ width: 64, height: 64 }}>
        <Icon size={32} />
      </div>
      <h3 className="h6 fw-bold mb-1">{title}</h3>
      <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: 400 }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <button className="btn btn-primary-scrapex btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
