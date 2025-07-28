import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../Components/Atoms/Icon';
import HeaderButton from '../../Components/Atoms/HeaderButton';
import { useHeaderContext } from '../../contexts/HeaderContext';
import './AppHeader.css';

// Компонент заголовка для главной страницы
const MainHeader = () => {
  const navigate = useNavigate();

  const handleNewMemoClick = () => {
    navigate('/memo/new');
  };

  return (
    <header className="app-header">
      <div className="app-header__container">
        <div className="app-header__content">
          <div className="app-header__logo">
            <div className="app-header__logo-icon">
              <Icon src="/img/logo-icon.svg" alt="Logo" />
            </div>
            <span className="app-header__logo-text">My Voice Memos</span>
          </div>
          
          <HeaderButton
            iconSrc="/img/plus-icon.svg"
            iconAlt="Add memo"
            onClick={handleNewMemoClick}
            className="app-header__new-memo-button"
          >
            New Memo
          </HeaderButton>
        </div>
      </div>
    </header>
  );
};

// Компонент заголовка для страницы редактора
const EditorHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const headerData = useHeaderContext();
  
  const isNewMemo = location.pathname === '/memo/new';

  const handleBack = () => {
    navigate('/');
  };

  return (
    <header className="app-header app-header--editor">
      <div className="app-header__container">
        <div className="app-header__content">
          <div className="app-header__left">
            <button 
              className="app-header__back-button"
              onClick={handleBack}
            >
              <Icon src="/img/back-icon.svg" alt="Back" />
            </button>
            <h1 className="app-header__title">
              {isNewMemo ? 'New Note' : 'Note'}
            </h1>
          </div>
          
          <div className="app-header__right">
            {!isNewMemo && headerData.lastEdited && (
              <span className="app-header__last-edited">
                Last edited {headerData.lastEdited}
              </span>
            )}
            <HeaderButton
              onClick={headerData.onSave}
              disabled={headerData.isSaving || !headerData.hasUnsavedChanges}
              isLoading={headerData.isSaving}
              className="app-header__save-button"
            >
              Save
            </HeaderButton>
          </div>
        </div>
      </div>
    </header>
  );
};

// Основной компонент AppHeader
const AppHeader = () => {
  const location = useLocation();
  const isEditorPage = location.pathname.includes('/memo/');

  // Рендерим соответствующий компонент без условного вызова хуков
  if (isEditorPage) {
    return <EditorHeader />;
  }

  return <MainHeader />;
};

export default AppHeader; 