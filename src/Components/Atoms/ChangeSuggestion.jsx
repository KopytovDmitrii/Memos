import React from 'react';
import './ChangeSuggestion.css';

const ChangeSuggestion = ({ text, onClick, style }) => {
  return (
    <div 
      className="change-suggestion" 
      onClick={onClick}
      style={style}
      title={text}
    >
      {text}
    </div>
  );
};

export default ChangeSuggestion; 