import React from 'react'
import './MemoCardDescription.css'

const MemoCardDescription = ({ children, className = '' }) => {
  return (
    <div className={`memo-card-description ${className}`}>
      {children}
    </div>
  )
}

export default MemoCardDescription 