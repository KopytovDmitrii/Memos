import React from 'react';
import './VoiceEditButton.css';

const VoiceEditButton = ({ onClick, disabled, children, isActive = false }) => {
  const getButtonClass = () => {
    let baseClass = 'voice-edit-button';
    if (isActive) {
      baseClass += ' voice-edit-button--active';
    }
    return baseClass;
  };

  return (
    <button 
      className={getButtonClass()} 
      onClick={onClick}
      disabled={disabled}
    >
      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
      </svg>
      {children}
    </button>
  );
};

export default VoiceEditButton; 