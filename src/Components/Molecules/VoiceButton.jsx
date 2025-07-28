import React from 'react';
import Icon from '../Atoms/Icon';
import './VoiceButton.css';

const VoiceButton = ({ 
  type = 'edit', 
  onClick, 
  className = '', 
  isActive = false,
  isRecording = false,
  isListening = false
}) => {
  const isEdit = type === 'edit';
  
  const getIconSrc = () => {
    if (isRecording || isListening) {
      return '/img/pause-icon.svg';
    }
    
    if (isEdit) {
      return '/img/edit-voice-icon.svg';
    }
    
    return '/img/microphone-icon.svg';
  };

  const getButtonText = () => {
    if (isRecording || isListening) {
      return 'Stop Voice Input';
    }
    
    if (isEdit) {
      return 'Edit with Voice';
    }
    
    return 'Add to note with voice';
  };

  const getButtonClass = () => {
    let baseClass = `voice-button voice-button--${type} ${className}`;
    
    if (isActive || isRecording || isListening) {
      baseClass += ' voice-button--active';
    }
    
    if (isRecording) {
      baseClass += ' voice-button--recording';
    }
    
    if (isListening) {
      baseClass += ' voice-button--listening';
    }
    
    return baseClass;
  };

  return (
    <button 
      className={getButtonClass()}
      onClick={onClick}
    >
      <div className="voice-button__icon">
        <Icon 
          src={getIconSrc()} 
          alt={getButtonText()}
        />
      </div>
      <span className="voice-button__text">
        {getButtonText()}
      </span>
    </button>
  );
};

export default VoiceButton; 