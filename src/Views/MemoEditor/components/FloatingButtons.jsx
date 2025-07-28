import React from 'react';
import CircularButton from '../../../Components/Atoms/CircularButton';
import CheckIcon from '../../../Components/Atoms/CheckIcon';
import CloseIcon from '../../../Components/Atoms/CloseIcon';
import './FloatingButtons.css';

const FloatingButtons = ({
  isVoiceEditing,
  isSavingLocal,
  isNewMemo,
  onApplyChanges,
  onCancelChanges,
  onBack,
  onDelete
}) => {
  return (
    <div className="floating-buttons">
      {isVoiceEditing && (
        <>
          <button 
            className="floating-buttons__action-button apply" 
            onClick={onApplyChanges}
            title="Применить все изменения"
          >
            <CheckIcon />
          </button>
          <button 
            className="floating-buttons__action-button cancel" 
            onClick={onCancelChanges}
            title="Отменить изменения"
          >
            <CloseIcon />
          </button>
        </>
      )}
      
      <CircularButton
        src="/img/back-icon.svg"
        alt="Back"
        size="large"
        variant="primary"
        onClick={onBack}
        disabled={isSavingLocal}
        title="Back to list"
      />
      
      <CircularButton
        src="/img/delete-icon.svg"
        alt="Delete"
        size="large"
        variant="danger"
        onClick={onDelete}
        disabled={isSavingLocal}
        title={isNewMemo ? "Cancel" : "Delete memo"}
      />
    </div>
  );
};

export default FloatingButtons; 