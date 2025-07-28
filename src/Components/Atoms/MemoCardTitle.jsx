import React from 'react'
import './MemoCardTitle.css'

const MemoCardTitle = ({ children, className = '' }) => {
  return (
    <div className={`memo-card-title ${className}`}>
      {children}
    </div>
  )
}

export default MemoCardTitle 