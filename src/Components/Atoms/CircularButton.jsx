import React from 'react';
import Icon from './Icon';
import './CircularButton.css';

const CircularButton = ({ 
  src, 
  alt, 
  size = 'medium', 
  variant = 'secondary',
  disabled = false,
  onClick,
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    'circular-button',
    `circular-button--${size}`,
    `circular-button--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <Icon 
        src={src} 
        alt={alt}
        className="circular-button__icon"
      />
    </button>
  );
};

export default CircularButton; 
 