import { useState, useEffect, useCallback } from 'react';
import voiceService from '../services/voiceService';

export const useVoice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    // Подписываемся на изменения статуса
    voiceService.onStatusChange((status) => {
      setIsRecording(status.isRecording);
      setIsListening(status.isListening);
    });

    // Очистка при размонтировании
    return () => {
      voiceService.cleanup();
    };
  }, []);

  // Начать распознавание речи для преобразования в текст
  const startListening = useCallback((onTranscript, onError) => {
    voiceService.startListening(onTranscript, onError);
  }, []);

  // Остановить распознавание речи
  const stopListening = useCallback(() => {
    voiceService.stopListening();
  }, []);

  // Начать запись голосовой заметки
  const startVoiceRecording = useCallback((onVoiceNote, onError) => {
    voiceService.startVoiceRecording(onVoiceNote, onError);
  }, []);

  // Остановить запись голосовой заметки
  const stopVoiceRecording = useCallback(() => {
    voiceService.stopVoiceRecording();
  }, []);

  // Воспроизвести голосовую заметку
  const playVoiceNote = useCallback((audioUrl, onProgress, onEnd) => {
    const audio = voiceService.playVoiceNote(audioUrl, onProgress, onEnd);
    setCurrentAudio(audio);
    return audio;
  }, []);

  // Остановить воспроизведение
  const stopPlayback = useCallback(() => {
    if (currentAudio) {
      voiceService.stopPlayback(currentAudio);
      setCurrentAudio(null);
    }
  }, [currentAudio]);

  // Получить текущий статус
  const getStatus = useCallback(() => {
    return voiceService.getStatus();
  }, []);

  return {
    isRecording,
    isListening,
    startListening,
    stopListening,
    startVoiceRecording,
    stopVoiceRecording,
    playVoiceNote,
    stopPlayback,
    getStatus
  };
}; 