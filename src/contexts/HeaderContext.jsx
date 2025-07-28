import React, { createContext, useContext, useState, useCallback } from 'react';

const HeaderContext = createContext();

export const HeaderProvider = ({ children, value }) => {
  const [headerState, setHeaderState] = useState({
    lastEdited: value?.lastEdited || null,
    onSave: value?.onSave || null,
    isSaving: value?.isSaving || false,
    hasUnsavedChanges: value?.hasUnsavedChanges || false
  });

  const updateHeaderState = useCallback((updates) => {
    setHeaderState(prev => ({ ...prev, ...updates }));
  }, []);

  const setLastEdited = useCallback((lastEdited) => {
    updateHeaderState({ lastEdited });
  }, [updateHeaderState]);

  const setOnSave = useCallback((onSave) => {
    updateHeaderState({ onSave });
  }, [updateHeaderState]);

  const setIsSaving = useCallback((isSaving) => {
    updateHeaderState({ isSaving });
  }, [updateHeaderState]);

  const setHasUnsavedChanges = useCallback((hasUnsavedChanges) => {
    updateHeaderState({ hasUnsavedChanges });
  }, [updateHeaderState]);

  const contextValue = {
    ...headerState,
    setLastEdited,
    setOnSave,
    setIsSaving,
    setHasUnsavedChanges
  };

  return (
    <HeaderContext.Provider value={contextValue}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeaderContext must be used within a HeaderProvider');
  }
  return context;
}; 