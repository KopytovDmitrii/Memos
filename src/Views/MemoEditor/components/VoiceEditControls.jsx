import React from 'react';
import VoiceEditButton from '../../../Components/Molecules/VoiceEditButton';
import VoiceButton from '../../../Components/Molecules/VoiceButton';
import './VoiceEditControls.css';

const VoiceEditControls = ({
  voiceEdit,
  isEditListening,
  isAddRecording,
  isAddListening,
  voiceEditLoading,
  onEditVoice,
  onAddVoice
}) => {
  return (
    <div className="voice-edit-controls">
      {voiceEdit && (
        <VoiceEditButton 
          onClick={onEditVoice}
          disabled={voiceEditLoading}
          isActive={isEditListening}
        >
          {voiceEditLoading ? 'Обработка...' : 'Edit with voice'}
        </VoiceEditButton>
      )}
      <VoiceButton 
        type="add"
        onClick={onAddVoice}
        isRecording={isAddRecording}
        isListening={isAddListening}
      />
      

    </div>
  );
};

export default VoiceEditControls; 