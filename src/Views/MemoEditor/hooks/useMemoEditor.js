import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMemos } from '../../../hooks/useMemos';
import { generateDefaultTitle, validateMemoData } from '../../../utils/index.js';

export const useMemoEditor = (id, existingMemo) => {
  const navigate = useNavigate();
  const { createMemo, updateMemo, deleteMemo } = useMemos();
  
  const isNewMemo = id === 'new' || id === undefined || !id;
  
  const initialMemoState = {
    id: id || 'new',
    title: '',
    content: '',
    lastEdited: 'Just now',
    voiceNotes: []
  };

  const [memo, setMemo] = useState(initialMemoState);
  const [initialMemo, setInitialMemo] = useState(initialMemoState);

  const [isSavingLocal, setIsSavingLocal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedMemo, setSavedMemo] = useState(null);

  // Обновляем memo при изменении existingMemo
  useEffect(() => {
    if (!isNewMemo && existingMemo) {
      const newMemo = {
        id: existingMemo.id,
        title: existingMemo.title || '',
        content: existingMemo.description || '',
        lastEdited: existingMemo.lastEdited || 'Just now',
        voiceNotes: existingMemo.voiceNotes || []
      };
      const savedMemoData = {
        id: existingMemo.id,
        title: existingMemo.title || '',
        description: existingMemo.description || '',
        lastEdited: existingMemo.lastEdited || 'Just now',
        voiceNotes: existingMemo.voiceNotes || []
      };
      setMemo(newMemo);
      setSavedMemo(savedMemoData);
      setHasUnsavedChanges(false);
    } else if (isNewMemo) {
      // Для новых заметок сбрасываем savedMemo
      setSavedMemo(null);
      setHasUnsavedChanges(false);
    }
  }, [existingMemo, isNewMemo]);

  // Отслеживаем изменения
  useEffect(() => {
    if (savedMemo) {
      // Для существующих заметок сравниваем с сохраненным состоянием
      const hasChanges = 
        memo.title !== savedMemo.title ||
        memo.content !== savedMemo.description ||
        JSON.stringify(memo.voiceNotes) !== JSON.stringify(savedMemo.voiceNotes);
      
      setHasUnsavedChanges(hasChanges);
    } else if (isNewMemo) {
      // Для новых заметок кнопка активна, если есть хоть какой-то контент
      const hasContent = 
        memo.title.trim() !== '' ||
        memo.content.trim() !== '' ||
        memo.voiceNotes.length > 0;
      
      setHasUnsavedChanges(hasContent);
    } else {
      // Для существующих заметок, которые еще не были сохранены в этой сессии
      // Кнопка должна быть неактивна, пока не будет изменений
      setHasUnsavedChanges(false);
    }
  }, [memo, savedMemo, isNewMemo]);

  const handleSave = useCallback(async () => {
    if (isSavingLocal) return;
    
    const title = memo.title || generateDefaultTitle(memo.content);
    const memoData = {
      title,
      description: memo.content,
      type: 'text',
      voiceNotes: memo.voiceNotes
    };

    const validation = validateMemoData(memoData);
    if (!validation.isValid) {
      console.error('Ошибки валидации:', validation.errors);
      return;
    }

    try {
      setIsSavingLocal(true);
      if (isNewMemo || memo.id === 'new') {
        const createdMemo = await createMemo(memoData);
        // Обновляем memo с реальным ID после создания
        setMemo(prev => ({
          ...prev,
          id: createdMemo.id
        }));
        setSavedMemo(createdMemo);
        setHasUnsavedChanges(false);
      } else {
        await updateMemo(memo.id, memoData);
        setSavedMemo(memoData);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    } finally {
      setIsSavingLocal(false);
    }
  }, [isSavingLocal, memo, isNewMemo, createMemo, updateMemo]);

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (isNewMemo || memo.id === 'new') {
      navigate('/');
      return;
    }

    try {
      setIsDeleting(true);
      await deleteMemo(memo.id);
      navigate('/');
    } catch (error) {
      console.error('Ошибка удаления:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleTitleChange = (e) => {
    setMemo(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  const handleContentChange = (e) => {
    setMemo(prev => ({
      ...prev,
      content: e.target.value
    }));
  };

  const handleVoiceNotePlay = (voiceNoteId) => {
    const voiceNote = memo.voiceNotes.find(vn => vn.id === voiceNoteId);
    if (voiceNote) {
      // Логика воспроизведения будет передана через props
      return voiceNote;
    }
  };

  const handleVoiceNoteEdit = (voiceNoteId) => {
    const newTitle = prompt('Введите новое название для голосовой заметки:');
    if (newTitle) {
      setMemo(prev => ({
        ...prev,
        voiceNotes: prev.voiceNotes.map(vn => 
          vn.id === voiceNoteId ? { ...vn, title: newTitle } : vn
        )
      }));
    }
  };

  const handleVoiceNoteDelete = (voiceNoteId) => {
    setMemo(prev => ({
      ...prev,
      voiceNotes: prev.voiceNotes.filter(vn => vn.id !== voiceNoteId)
    }));
  };

  return {
    memo,
    setMemo,
    isNewMemo,
    isSavingLocal,
    showDeleteModal,
    isDeleting,
    hasUnsavedChanges,
    handleSave,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    handleBack,
    handleTitleChange,
    handleContentChange,
    handleVoiceNotePlay,
    handleVoiceNoteEdit,
    handleVoiceNoteDelete
  };
}; 