import React from 'react';
import { useNavigate } from 'react-router-dom';
import MemoCardTitle from '../../Components/Atoms/MemoCardTitle';
import MemoCardDescription from '../../Components/Atoms/MemoCardDescription';
import MemoCardMeta from '../../Components/Molecules/MemoCardMeta';
import MemoCardActions from '../../Components/Molecules/MemoCardActions';
import './MemoCard.css';

const MemoCard = ({ 
  memo, 
  onDelete, 
  className = '' 
}) => {
  const navigate = useNavigate();
  const { id, title, description, createdAt, type } = memo;

  const handleEdit = () => {
    navigate(`/memo/${id}`);
  };

  const handleDelete = () => {
    onDelete?.(id);
  };

  return (
    <div className={`memo-card ${className}`}>
      <div className="memo-card__content">
        <div className="memo-card__info">
          <MemoCardTitle>{title}</MemoCardTitle>
          <MemoCardDescription>{description}</MemoCardDescription>
          <MemoCardMeta 
            createdAt={createdAt}
            type={type}
            voiceNotes={memo.voiceNotes}
          />
        </div>
        <MemoCardActions
          onEdit={handleEdit}
          onDelete={handleDelete}
          memoTitle={title}
        />
      </div>
    </div>
  );
};

export default MemoCard;