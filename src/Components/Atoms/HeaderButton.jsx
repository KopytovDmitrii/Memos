import React from 'react';
import Icon from './Icon';
import './HeaderButton.css';

const HeaderButton = ({ 
  iconSrc, 
  iconAlt, 
  children, 
  onClick, 
  disabled = false,
  isLoading = false,
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    'header-button',
    'header-button--primary',
    isLoading ? 'header-button--saving' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {iconSrc && (
        <Icon 
          src={iconSrc} 
          alt={iconAlt}
          className="header-button__icon"
        />
      )}
      {children && (
        <span className="header-button__text">
          {isLoading ? 'Saving...' : children}
        </span>
      )}
    </button>
  );
};

export default HeaderButton; 