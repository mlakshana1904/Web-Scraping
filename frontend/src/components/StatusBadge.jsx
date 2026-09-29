import React from 'react';
import { FiCheckCircle, FiLoader, FiAlertCircle, FiClock } from 'react-icons/fi';

export default function StatusBadge({ status }) {
  const normalized = (status || 'SCHEDULED').toUpperCase();

  const getIcon = () => {
    switch (normalized) {
      case 'SUCCESS':
        return <FiCheckCircle size={14} />;
      case 'RUNNING':
        return <FiLoader size={14} className="spin" />;
      case 'FAILED':
        return <FiAlertCircle size={14} />;
      case 'SCHEDULED':
      default:
        return <FiClock size={14} />;
    }
  };

  return (
    <span className={`badge-status ${normalized}`}>
      {getIcon()}
      <span>{normalized}</span>
    </span>
  );
}
