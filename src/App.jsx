import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppHeader from './Views/Header/AppHeader';
import MemoList from './Views/MemoList/MemoList';
import MemoEditor from './Views/MemoEditor/MemoEditor';
import { HeaderProvider } from './contexts/HeaderContext';
import './App.css';

function App() {
  return (
    <Router>
      <HeaderProvider value={{ lastEdited: null, onSave: null, isSaving: false }}>
        <div className="App">
          <AppHeader />
          <Routes>
            <Route path="/" element={<MemoList />} />
            <Route path="/memo/new" element={<MemoEditor />} />
            <Route path="/memo/:id" element={<MemoEditor />} />
          </Routes>
        </div>
      </HeaderProvider>
    </Router>
  );
}

export default App; 