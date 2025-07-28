import React from 'react'
import Icon from '../Atoms/Icon'
import Text from '../Atoms/Text'
import ButtonWithIcon from './ButtonWithIcon'
import './EmptyState.css'

const EmptyState = ({ 
  title = 'No memos yet',
  description = 'Create your first voice memo to get started',
  buttonText = 'Create First Memo',
  buttonIcon = '/img/create-memo-icon.svg',
  onButtonClick,
  className = '' 
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state__icon-wrapper">
        <Icon 
          src="/img/microphone-icon.svg" 
          alt="Микрофон" 
          className="empty-state__icon" 
        />
      </div>
      <Text 
        variant="h3" 
        weight="medium" 
        className="empty-state__title"
      >
        {title}
      </Text>
      <Text 
        variant="body" 
        className="empty-state__description"
      >
        {description}
      </Text>
      <ButtonWithIcon
        iconSrc={buttonIcon}
        iconAlt="Создать заметку"
        onClick={onButtonClick}
        className="empty-state__button"
      >
        {buttonText}
      </ButtonWithIcon>
    </div>
  )
}

export default EmptyState 