import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  title = 'Подтверждение', 
  message, 
  confirmText = 'Удалить',
  cancelText = 'Отмена',
  onConfirm, 
  onCancel,
  onClose,
  isLoading = false
}) => {
  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Блокируем скролл body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Закрытие по клику на overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
        </div>
        
        <div className="modal__content">
          <p className="modal__message">{message}</p>
        </div>
        
        <div className="modal__actions">
          <button 
            className="modal__button modal__button--cancel"
            onClick={onCancel || onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            className="modal__button modal__button--confirm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Удаление...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal; 