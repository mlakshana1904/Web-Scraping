import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertTriangle, FiX } from 'react-icons/fi';

export default function ToastNotification({ type = 'success', message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1090 }}
    >
      <div 
        className={`toast show align-items-center text-white border-0 shadow-lg ${isSuccess ? 'bg-success' : 'bg-danger'}`}
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
      >
        <div className="d-flex p-2">
          <div className="toast-body d-flex align-items-center gap-2">
            {isSuccess ? <FiCheckCircle size={18} /> : <FiAlertTriangle size={18} />}
            <span>{message}</span>
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white me-2 m-auto" 
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
}
