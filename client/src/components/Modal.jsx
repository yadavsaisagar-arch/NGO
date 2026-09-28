import React from 'react';

const Modal = ({ isOpen, title = 'Message', message, onClose, onConfirm, confirmText = 'OK' }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div className="custom-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="message-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{title}</h2>
        {message && <p>{message}</p>}
        <button type="button" onClick={handleConfirm} autoFocus>
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default Modal;
