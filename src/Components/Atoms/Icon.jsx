import React from 'react'
import './Icon.css'

const Icon = ({ src, alt, className = '', ...props }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`icon ${className}`}
      {...props}
    />
  )
}

export default Icon 