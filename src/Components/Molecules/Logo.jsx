import React from 'react'
import Icon from '../Atoms/Icon'
import Text from '../Atoms/Text'
import './Logo.css'

const Logo = ({ className = '' }) => {
  return (
    <div className={`logo ${className}`}>
      <div className="logo__icon-wrapper">
        <Icon 
          src="/img/logo-icon.svg" 
          alt="Логотип" 
          className="logo__icon" 
        />
      </div>
      <Text 
        variant="h2" 
        weight="bold" 
        className="logo__text"
      >
        My Voice Memos
      </Text>
    </div>
  )
}

export default Logo 