import React from 'react';
import { useNavigate } from 'react-router-dom';
import MemoCard from '../MemoCard/MemoCard';
import EmptyState from '../../Components/Molecules/EmptyState';
import { useMemos } from '../../hooks/useMemos';
import './MemoList.css';

const MemoList = () => {
  const navigate = useNavigate();
  const { memos, loading, error, deleteMemo } = useMemos();

  const handleNewMemoClick = () => {
    navigate('/memo/new');
  };

  const handleDeleteMemo = async (id) => {
    try {
      await deleteMemo(id);
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  if (loading) {
    return (
      <div className="memo-list">
        <div className="memo-list__loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="memo-list">
        <div className="memo-list__error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="memo-list">
      {memos.length === 0 ? (
        <EmptyState onButtonClick={handleNewMemoClick} />
      ) : (
        <div className="memo-list__content">
          {memos.map(memo => (
            <MemoCard 
              key={memo.id} 
              memo={memo} 
              onDelete={handleDeleteMemo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoList; 