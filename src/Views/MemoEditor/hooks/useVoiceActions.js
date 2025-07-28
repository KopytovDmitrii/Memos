import { useState, useEffect } from 'react';
import { useVoice } from '../../../hooks/useVoice';
import { voiceEditApi } from '../../../services/api';
import { useCancellableRequest } from '../../../hooks/useCancellableRequest';

export const useVoiceActions = (memo, setMemo) => {
  const { 
    isRecording, 
    isListening, 
    startListening, 
    stopListening, 
    startVoiceRecording, 
    stopVoiceRecording,
    playVoiceNote,
    stopPlayback
  } = useVoice();
  
  // Локальные состояния для кнопок
  const [isEditListening, setIsEditListening] = useState(false);
  const [isAddRecording, setIsAddRecording] = useState(false);
  const [isAddListening, setIsAddListening] = useState(false);
  
  // Состояния для уведомлений
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Хук для отменяемых запросов
  const { makeCancellableRequest, cancelRequest } = useCancellableRequest();

  // Сброс локальных состояний при остановке распознавания
  useEffect(() => {
    if (!isListening) {
      setIsEditListening(false);
      setIsAddListening(false);
    }
  }, [isListening]);

  // Сброс состояний записи при остановке
  useEffect(() => {
    if (!isRecording) {
      setIsAddRecording(false);
    }
  }, [isRecording]);

  const handleEditVoice = async (voiceEditState) => {
    if (isEditListening) {
      setIsEditListening(false);
      stopListening();
    } else {
      setIsEditListening(true);
      voiceEditState.setOriginalContent(memo.content);
      
      startListening(
        async (transcript) => {
          // Останавливаем распознавание после получения инструкции
          setIsEditListening(false);
          stopListening();
          
          if (!transcript.trim()) {
            setToastMessage('Не удалось распознать голосовую инструкцию');
            setShowToast(true);
            return;
          }
          
          try {
            voiceEditState.setVoiceEditLoading(true);
            const result = await makeCancellableRequest(async (signal) => {
              return await voiceEditApi.editText(memo.content, transcript, signal);
            });
            console.log('API result:', result);
            
            // Преобразуем результат в новую структуру
            const voiceEditResult = {
              editedText: result.data.editedText || result.data.text || result.text
            };
            
            voiceEditState.setVoiceEditResult(voiceEditResult);
            voiceEditState.setIsVoiceEditing(true);
          } catch (error) {
            console.error('Ошибка редактирования голосом:', error);
            if (error.message === 'Запрос был отменен пользователем') {
              setToastMessage('Операция была отменена');
            } else {
              voiceEditState.setVoiceEditError(error.message);
              setToastMessage('Ошибка при редактировании текста голосом');
            }
            setShowToast(true);
          } finally {
            voiceEditState.setVoiceEditLoading(false);
          }
        },
        (error) => {
          console.error('Ошибка распознавания речи:', error);
          setIsEditListening(false);
          setToastMessage('Ошибка распознавания речи');
          setShowToast(true);
        }
      );
    }
  };

  const handleAddVoice = () => {
    if (isAddRecording || isAddListening) {
      stopVoiceRecording();
      stopListening();
      setIsAddRecording(false);
      setIsAddListening(false);
    } else {
      // Запускаем одновременно запись аудио и распознавание речи
      setIsAddRecording(true);
      setIsAddListening(true);
      
      startVoiceRecording(
        (voiceNote) => {
          // Добавляем голосовую заметку к списку
          setMemo(prev => ({
            ...prev,
            voiceNotes: [...prev.voiceNotes, voiceNote]
          }));
        },
        (error) => {
          console.error('Ошибка записи голосовой заметки:', error);
          setIsAddRecording(false);
          setIsAddListening(false);
        }
      );
      
      // Также запускаем распознавание речи для добавления текста
      startListening(
        (transcript) => {
          // Добавляем распознанный текст к содержимому
          setMemo(prev => ({
            ...prev,
            content: prev.content + (prev.content ? ' ' : '') + transcript
          }));
        },
        (error) => {
          console.error('Ошибка распознавания речи:', error);
          // Не показываем ошибку, так как аудио запись может работать
        }
      );
    }
  };

  const handleVoiceNotePlay = (voiceNoteId) => {
    const voiceNote = memo.voiceNotes.find(vn => vn.id === voiceNoteId);
    if (voiceNote) {
      playVoiceNote(
        voiceNote.audioUrl,
        (progress) => {
          // Обновляем прогресс воспроизведения
          setMemo(prev => ({
            ...prev,
            voiceNotes: prev.voiceNotes.map(vn => 
              vn.id === voiceNoteId ? { ...vn, progress } : vn
            )
          }));
        },
        () => {
          // Сброс прогресса после завершения
          setMemo(prev => ({
            ...prev,
            voiceNotes: prev.voiceNotes.map(vn => 
              vn.id === voiceNoteId ? { ...vn, progress: 0 } : vn
            )
          }));
        }
      );
    }
  };

  return {
    isEditListening,
    isAddRecording,
    isAddListening,
    showToast,
    toastMessage,
    setShowToast,
    handleEditVoice,
    handleAddVoice,
    handleVoiceNotePlay,
    cancelRequest
  };
}; 