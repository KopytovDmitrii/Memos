import React from 'react'
import './Button.css'

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  ...props 
}) => {
  const baseClasses = 'button'
  const variantClasses = {
    primary: 'button--primary',
    secondary: 'button--secondary'
  }
  const sizeClasses = {
    small: 'button--small',
    medium: 'button--medium',
    large: 'button--large'
  }

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ')

  return (
    <button 
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button 