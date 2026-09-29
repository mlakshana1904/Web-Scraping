import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmationDialog({ show, title, message, onConfirm, onCancel, confirmText = 'Confirm', variant = 'danger' }) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="h5 d-flex align-items-center gap-2">
          <FiAlertTriangle className={`text-${variant}`} size={22} />
          <span>{title || 'Confirm Action'}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-3 text-secondary">
        {message || 'Are you sure you want to proceed with this action?'}
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="outline-secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant={variant} size="sm" onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
