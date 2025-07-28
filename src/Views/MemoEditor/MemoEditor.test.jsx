import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import MemoEditor from './MemoEditor.jsx';

// Мокаем useConfig
const mockUseConfig = {
  voiceEdit: true
};

vi.mock('../../hooks/useConfig', () => ({
  useConfig: () => mockUseConfig
}));

// Мокаем HeaderContext
const mockHeaderContext = {
  setOnSave: vi.fn(),
  setIsSaving: vi.fn(),
  setHasUnsavedChanges: vi.fn()
};

vi.mock('../../contexts/HeaderContext', () => ({
  useHeaderContext: () => mockHeaderContext
}));

// Мокаем useMemos
const mockMemos = [
  {
    id: 'test-id-1',
    title: 'Test Memo',
    description: 'Test content',
    type: 'text',
    createdAt: '2023-01-01T00:00:00.000Z'
  }
];

const mockUseMemos = {
  memos: mockMemos,
  loading: false,
  error: null,
  createMemo: vi.fn(),
  updateMemo: vi.fn(),
  deleteMemo: vi.fn()
};

vi.mock('../../hooks/useMemos', () => ({
  useMemos: () => mockUseMemos
}));

// Мокаем useVoice
const mockUseVoice = {
  isRecording: false,
  isListening: false,
  startListening: vi.fn(),
  stopListening: vi.fn(),
  startVoiceRecording: vi.fn(),
  stopVoiceRecording: vi.fn(),
  playVoiceNote: vi.fn(),
  stopPlayback: vi.fn()
};

vi.mock('../../hooks/useVoice', () => ({
  useVoice: () => mockUseVoice
}));

// Мокаем useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: 'new' })
  };
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('MemoEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMemos.memos = mockMemos;
    mockUseMemos.loading = false;
    mockUseMemos.error = null;
    mockUseConfig.voiceEdit = true;
  });

  it('renders new memo form correctly', () => {
    renderWithRouter(<MemoEditor />);
    
    expect(screen.getByPlaceholderText('Enter note title...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Start typing your note...')).toBeInTheDocument();
  });

  it('handles title input change', () => {
    renderWithRouter(<MemoEditor />);
    
    const titleInput = screen.getByPlaceholderText('Enter note title...');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    
    expect(titleInput.value).toBe('New Title');
  });

  it('handles content input change', () => {
    renderWithRouter(<MemoEditor />);
    
    const contentInput = screen.getByPlaceholderText('Start typing your note...');
    fireEvent.change(contentInput, { target: { value: 'New content' } });
    
    expect(contentInput.value).toBe('New content');
  });

  it('renders floating buttons', () => {
    renderWithRouter(<MemoEditor />);
    
    expect(screen.getByTitle('Back to list')).toBeInTheDocument();
    expect(screen.getByTitle('Cancel')).toBeInTheDocument();
  });

  it('handles back button click', () => {
    renderWithRouter(<MemoEditor />);
    
    const backButton = screen.getByTitle('Back to list');
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('handles save function correctly', async () => {
    mockUseMemos.createMemo.mockResolvedValue({ id: 'new-id' });
    
    renderWithRouter(<MemoEditor />);
    
    // Ждем, пока компонент полностью загрузится
    await waitFor(() => {
      expect(mockHeaderContext.setOnSave).toHaveBeenCalled();
    });
    
    // Получаем функцию сохранения
    const saveFunction = mockHeaderContext.setOnSave.mock.calls[0][0];
    
    // Вызываем функцию сохранения напрямую
    await saveFunction();
    
    expect(mockUseMemos.createMemo).toHaveBeenCalledWith({
      title: 'Untitled Memo',
      description: '',
      type: 'text',
      voiceNotes: []
    });
    // Больше не ожидаем навигацию, так как сохраняем без перехода
  });

  it('shows edit voice button when voiceEdit is enabled', () => {
    mockUseConfig.voiceEdit = true;
    renderWithRouter(<MemoEditor />);
    
    expect(screen.getByText('Edit with voice')).toBeInTheDocument();
  });

  it('hides edit voice button when voiceEdit is disabled', () => {
    mockUseConfig.voiceEdit = false;
    renderWithRouter(<MemoEditor />);
    
    expect(screen.queryByText('Edit with voice')).not.toBeInTheDocument();
  });

  it('always shows add voice button regardless of voiceEdit setting', () => {
    mockUseConfig.voiceEdit = false;
    renderWithRouter(<MemoEditor />);
    
    expect(screen.getByText('Add to note with voice')).toBeInTheDocument();
  });
}); 