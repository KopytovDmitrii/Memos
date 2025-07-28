import React from 'react';
import './Input.css';

const Input = ({ value, onChange, placeholder, className = '' }) => {
  return (
    <input
      type="text"
      className={`input ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default Input; 