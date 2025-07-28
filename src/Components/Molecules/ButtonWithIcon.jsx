import React from 'react';
import Icon from '../Atoms/Icon';
import './ButtonWithIcon.css';

const ButtonWithIcon = ({ 
  iconSrc, 
  iconAlt, 
  children, 
  onClick, 
  className = '',
  variant = 'primary'
}) => {
  return (
    <button 
      className={`button-with-icon button-with-icon--${variant} ${className}`}
      onClick={onClick}
    >
      <Icon src={iconSrc} alt={iconAlt} className="button-with-icon__icon" />
      {children && <span className="button-with-icon__text">{children}</span>}
    </button>
  );
};

export default ButtonWithIcon; 