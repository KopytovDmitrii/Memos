import React from 'react'
import './Text.css'

const Text = ({ 
  children, 
  variant = 'body', 
  weight = 'normal',
  className = '',
  ...props 
}) => {
  const baseClasses = 'text'
  const variantClasses = {
    h1: 'text--h1',
    h2: 'text--h2', 
    h3: 'text--h3',
    body: 'text--body',
    caption: 'text--caption'
  }
  const weightClasses = {
    normal: 'text--normal',
    medium: 'text--medium',
    semibold: 'text--semibold',
    bold: 'text--bold'
  }

  const classes = [
    baseClasses,
    variantClasses[variant],
    weightClasses[weight],
    className
  ].filter(Boolean).join(' ')

  const Tag = variant.startsWith('h') ? variant : 'span'

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  )
}

export default Text 