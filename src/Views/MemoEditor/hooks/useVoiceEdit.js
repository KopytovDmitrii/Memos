import { useState, useCallback } from 'react';

export const useVoiceEdit = () => {
  const [isVoiceEditing, setIsVoiceEditing] = useState(false);
  const [voiceEditLoading, setVoiceEditLoading] = useState(false);
  const [voiceEditError, setVoiceEditError] = useState(null);
  const [voiceEditResult, setVoiceEditResult] = useState(null);
  const [originalContent, setOriginalContent] = useState('');

  const clearVoiceEditState = useCallback(() => {
    setIsVoiceEditing(false);
    setVoiceEditResult(null);
    setVoiceEditError(null);
    setOriginalContent('');
  }, []);

  return {
    isVoiceEditing,
    voiceEditLoading,
    voiceEditError,
    voiceEditResult,
    originalContent,
    clearVoiceEditState,
    setVoiceEditLoading,
    setVoiceEditError,
    setVoiceEditResult,
    setIsVoiceEditing,
    setOriginalContent
  };
}; 