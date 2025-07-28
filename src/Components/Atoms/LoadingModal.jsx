import React, { useEffect } from 'react';
import Loader from './Loader';
import './LoadingModal.css';

const LoadingModal = ({ 
  isOpen, 
  title = 'Обработка',
  message = 'Пожалуйста, подождите...',
  onCancel,
  onClose
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
    <div className="loading-modal-overlay" onClick={handleOverlayClick}>
      <div className="loading-modal">
        <div className="loading-modal__header">
          <h3 className="loading-modal__title">{title}</h3>
        </div>
        
        <div className="loading-modal__content">
          <Loader text={message} />
        </div>
        
        <div className="loading-modal__actions">
          <button 
            className="loading-modal__button loading-modal__button--cancel"
            onClick={onCancel || onClose}
          >
            Прервать
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal; 