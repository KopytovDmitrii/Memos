import React, { useState } from 'react';
import CircularButton from '../Atoms/CircularButton';
import Modal from '../Atoms/Modal';
import './VoiceNoteItem.css';

const VoiceNoteItem = ({ 
  title, 
  duration, 
  addedTime, 
  progress = 0, 
  isPlaying = false,
  onPlay,
  onDelete 
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
    } catch (error) {
      console.error('Ошибка удаления голосовой заметки:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="voice-note-item">
        <div className="voice-note-item__main-content">
          <div className="voice-note-item__content">
            <CircularButton
              src={isPlaying ? '/img/pause-icon.svg' : '/img/play-voice-note.svg'}
              alt={isPlaying ? 'Pause' : 'Play'}
              size="medium"
              variant="secondary"
              onClick={onPlay}
            />
            
            <div className="voice-note-item__info">
              <h4 className="voice-note-item__title">{title}</h4>
              <p className="voice-note-item__meta">{duration} • {addedTime}</p>
            </div>
          </div>
          
          <div className="voice-note-item__actions">
            <CircularButton
              src="/img/delete-voice-note.svg"
              alt="Delete"
              size="small"
              variant="transparent"
              onClick={handleDeleteClick}
            />
          </div>
        </div>
        
        <div className="voice-note-item__progress-container">
          <div className="voice-note-item__progress">
            <div 
              className="voice-note-item__progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        title="Удалить голосовую заметку"
        message={`Вы уверены, что хотите удалить голосовую заметку "${title}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        onClose={handleCancelDelete}
        isLoading={isDeleting}
      />
    </>
  );
};

export default VoiceNoteItem; 