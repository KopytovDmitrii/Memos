import React from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../../Components/Atoms/Modal';
import LoadingModal from '../../Components/Atoms/LoadingModal';
import Input from '../../Components/Atoms/Input';
import Toast from '../../Components/Atoms/Toast';
import { useHeaderContext } from '../../contexts/HeaderContext';
import { useMemos } from '../../hooks/useMemos';
import { useConfig } from '../../hooks/useConfig';
import VoiceEditControls from './components/VoiceEditControls';
import TextEditor from './components/TextEditor';
import FloatingButtons from './components/FloatingButtons';
import VoiceNotesList from './components/VoiceNotesList';
import { useVoiceEdit } from './hooks/useVoiceEdit';
import { useMemoEditor } from './hooks/useMemoEditor';
import { useVoiceActions } from './hooks/useVoiceActions';
import './MemoEditor.css';

const MemoEditor = () => {
  const { id } = useParams();
  const { memos } = useMemos();
  const { setOnSave, setIsSaving, setHasUnsavedChanges } = useHeaderContext();
  const { voiceEdit } = useConfig();
  
  const existingMemo = memos.find(m => m.id === id);
  
  // Хуки для управления состоянием
  const memoEditor = useMemoEditor(id, existingMemo);
  const voiceActions = useVoiceActions(memoEditor.memo, memoEditor.setMemo);
  const voiceEditState = useVoiceEdit();
  
  // Устанавливаем обработчики для header
  React.useEffect(() => {
    setOnSave(memoEditor.handleSave);
  }, [memoEditor.handleSave, setOnSave]);

  React.useEffect(() => {
    setIsSaving(memoEditor.isSavingLocal);
  }, [memoEditor.isSavingLocal, setIsSaving]);

  // Передаем информацию о несохраненных изменениях
  React.useEffect(() => {
    setHasUnsavedChanges(memoEditor.hasUnsavedChanges);
  }, [memoEditor.hasUnsavedChanges, setHasUnsavedChanges]);

  const handleContentChange = (newContent) => {
    memoEditor.setMemo(prev => ({
      ...prev,
      content: newContent
    }));
  };

  const handleApplyChanges = () => {
    if (voiceEditState.voiceEditResult && voiceEditState.voiceEditResult.editedText) {
      console.log('voiceEditResult:', voiceEditState.voiceEditResult);
      
      memoEditor.setMemo(prev => ({
        ...prev,
        content: voiceEditState.voiceEditResult.editedText
      }));
      
      voiceEditState.clearVoiceEditState();
    } else {
      console.error('voiceEditResult.editedText не найден:', voiceEditState.voiceEditResult);
      voiceActions.setToastMessage('Ошибка: не удалось применить изменения');
      voiceActions.setShowToast(true);
    }
  };

  const handleCancelChanges = () => {
    // Возвращаемся к оригинальному контенту
    if (voiceEditState.originalContent !== '') {
      memoEditor.setMemo(prev => ({
        ...prev,
        content: voiceEditState.originalContent
      }));
    }
    voiceEditState.clearVoiceEditState();
  };

  return (
    <div className="memo-editor">
      <main className="memo-editor__main">
        <div className="memo-editor__title-input">
          <Input
            value={memoEditor.memo.title}
            onChange={memoEditor.handleTitleChange}
            placeholder="Enter note title..."
          />
        </div>

        <VoiceEditControls
          voiceEdit={voiceEdit}
          isEditListening={voiceActions.isEditListening}
          isAddRecording={voiceActions.isAddRecording}
          isAddListening={voiceActions.isAddListening}
          voiceEditLoading={voiceEditState.voiceEditLoading}
          onEditVoice={() => voiceActions.handleEditVoice(voiceEditState)}
          onAddVoice={voiceActions.handleAddVoice}
        />

        <div className="memo-editor__content">
          <TextEditor
            value={memoEditor.memo.content}
            onChange={handleContentChange}
            isVoiceEditing={voiceEditState.isVoiceEditing}
            voiceEditResult={voiceEditState.voiceEditResult}
            placeholder="Start typing your note..."
          />
        </div>

        <VoiceNotesList
          voiceNotes={memoEditor.memo.voiceNotes}
          onPlay={voiceActions.handleVoiceNotePlay}
          onEdit={memoEditor.handleVoiceNoteEdit}
          onDelete={memoEditor.handleVoiceNoteDelete}
        />
      </main>

      <FloatingButtons
        isVoiceEditing={voiceEditState.isVoiceEditing}
        isSavingLocal={memoEditor.isSavingLocal}
        isNewMemo={memoEditor.isNewMemo}
        onApplyChanges={handleApplyChanges}
        onCancelChanges={handleCancelChanges}
        onBack={memoEditor.handleBack}
        onDelete={memoEditor.handleDelete}
      />

      <LoadingModal
        isOpen={voiceEditState.voiceEditLoading}
        title="Обработка голосовой инструкции"
        message="Пожалуйста, подождите. Обрабатывается ваша голосовая инструкция..."
        onCancel={() => {
          voiceActions.cancelRequest();
          voiceEditState.setVoiceEditLoading(false);
        }}
        onClose={() => {
          voiceActions.cancelRequest();
          voiceEditState.setVoiceEditLoading(false);
        }}
      />

      {voiceActions.showToast && (
        <Toast
          message={voiceActions.toastMessage}
          type="error"
          onClose={() => voiceActions.setShowToast(false)}
        />
      )}

      <Modal
        isOpen={memoEditor.showDeleteModal}
        title={memoEditor.isNewMemo ? "Отменить создание" : "Удалить заметку"}
        message={memoEditor.isNewMemo 
          ? "Вы уверены, что хотите отменить создание заметки? Все несохраненные изменения будут потеряны."
          : "Вы уверены, что хотите удалить эту заметку? Это действие нельзя отменить."
        }
        confirmText={memoEditor.isNewMemo ? "Отменить" : "Удалить"}
        cancelText="Сохранить"
        onConfirm={memoEditor.handleConfirmDelete}
        onCancel={memoEditor.handleCancelDelete}
        onClose={memoEditor.handleCancelDelete}
        isLoading={memoEditor.isDeleting}
      />
    </div>
  );
};

export default MemoEditor; 