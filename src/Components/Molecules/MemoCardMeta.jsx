import React from 'react'
import Icon from '../Atoms/Icon'
import './MemoCardMeta.css'

const MemoCardMeta = ({ createdAt, type, voiceNotes = [], className = '' }) => {
  const formatTimeAgo = (date) => {
    const now = new Date()
    const created = new Date(date)
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  const hasVoiceNotes = voiceNotes && voiceNotes.length > 0
  const hasText = type === 'text' || type === 'mixed'

  const getTypeIcons = () => {
    if (hasVoiceNotes && hasText) {
      return [
        { src: '/img/pen-icon.svg', alt: 'Text' },
        { src: '/img/microphone-icon.svg', alt: 'Voice' }
      ]
    } else if (hasVoiceNotes) {
      return [{ src: '/img/microphone-icon.svg', alt: 'Voice' }]
    } else {
      return [{ src: '/img/pen-icon.svg', alt: 'Text' }]
    }
  }

  const getTypeText = () => {
    if (hasVoiceNotes && hasText) {
      return 'Text & Voice'
    } else if (hasVoiceNotes) {
      return 'Voice recorded'
    } else {
      return 'Text'
    }
  }

  return (
    <div className={`memo-card-meta ${className}`}>
      <div className="memo-card-meta__item">
        <span>{formatTimeAgo(createdAt)}</span>
      </div>
      <div className="memo-card-meta__item">
        {getTypeIcons().map((icon, index) => (
          <Icon 
            key={index}
            src={icon.src} 
            alt={icon.alt} 
            className="memo-card-meta__icon" 
          />
        ))}
        <span>{getTypeText()}</span>
      </div>
    </div>
  )
}

export default MemoCardMeta 