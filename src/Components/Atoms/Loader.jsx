import React from 'react';
import './Loader.css';

const Loader = ({ text = 'Загрузка...' }) => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <span>{text}</span>
    </div>
  );
};

export default Loader; 