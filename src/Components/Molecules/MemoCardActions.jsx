import React, { useState } from 'react'
import CircularButton from '../Atoms/CircularButton'
import Modal from '../Atoms/Modal'
import './MemoCardActions.css'

const MemoCardActions = ({ onEdit, onDelete, memoTitle, className = '' }) => {
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
      console.error('Ошибка удаления заметки:', error);
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
      <div className={`memo-card-actions ${className}`}>
        <CircularButton
          src="/img/edit-icon.svg"
          alt="Редактировать"
          size="small"
          variant="transparent"
          onClick={onEdit}
          title="Редактировать"
        />
        <CircularButton
          src="/img/delete-icon.svg"
          alt="Удалить"
          size="small"
          variant="transparent"
          onClick={handleDeleteClick}
          title="Удалить"
        />
      </div>

      <Modal
        isOpen={showDeleteModal}
        title="Удалить заметку"
        message={`Вы уверены, что хотите удалить заметку "${memoTitle}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        onClose={handleCancelDelete}
        isLoading={isDeleting}
      />
    </>
  )
}

export default MemoCardActions 