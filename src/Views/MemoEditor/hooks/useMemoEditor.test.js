import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMemoEditor } from './useMemoEditor';

// Мокаем useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

// Мокаем useMemos
const mockCreateMemo = vi.fn();
const mockUpdateMemo = vi.fn();
const mockDeleteMemo = vi.fn();
vi.mock('../../../hooks/useMemos', () => ({
  useMemos: () => ({
    createMemo: mockCreateMemo,
    updateMemo: mockUpdateMemo,
    deleteMemo: mockDeleteMemo
  })
}));

// Мокаем utils
vi.mock('../../../utils/index.js', () => ({
  generateDefaultTitle: (content) => content ? 'Generated Title' : 'Untitled Memo',
  validateMemoData: (data) => ({ isValid: true, errors: [] })
}));

describe('useMemoEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have hasUnsavedChanges false for new memo initially', () => {
    const { result } = renderHook(() => useMemoEditor('new', null));
    
    expect(result.current.hasUnsavedChanges).toBe(false);
  });

  it('should have hasUnsavedChanges true when title is added to new memo', () => {
    const { result } = renderHook(() => useMemoEditor('new', null));
    
    act(() => {
      result.current.handleTitleChange({ target: { value: 'Test Title' } });
    });
    
    expect(result.current.hasUnsavedChanges).toBe(true);
  });

  it('should have hasUnsavedChanges true when content is added to new memo', () => {
    const { result } = renderHook(() => useMemoEditor('new', null));
    
    act(() => {
      result.current.handleContentChange({ target: { value: 'Test content' } });
    });
    
    expect(result.current.hasUnsavedChanges).toBe(true);
  });

  it('should have hasUnsavedChanges false when content is empty', () => {
    const { result } = renderHook(() => useMemoEditor('new', null));
    
    act(() => {
      result.current.handleTitleChange({ target: { value: '   ' } });
      result.current.handleContentChange({ target: { value: '   ' } });
    });
    
    expect(result.current.hasUnsavedChanges).toBe(false);
  });

  it('should have hasUnsavedChanges true when voice notes are added', () => {
    const { result } = renderHook(() => useMemoEditor('new', null));
    
    act(() => {
      result.current.setMemo(prev => ({
        ...prev,
        voiceNotes: [{ id: '1', title: 'Voice Note' }]
      }));
    });
    
    expect(result.current.hasUnsavedChanges).toBe(true);
  });

  it('should handle save for new memo', async () => {
    const mockCreatedMemo = { id: 'new-id', title: 'Test', description: 'Content' };
    mockCreateMemo.mockResolvedValue(mockCreatedMemo);
    
    const { result } = renderHook(() => useMemoEditor('new', null));
    
    act(() => {
      result.current.handleTitleChange({ target: { value: 'Test Title' } });
    });
    
    await act(async () => {
      await result.current.handleSave();
    });
    
    expect(mockCreateMemo).toHaveBeenCalledWith({
      title: 'Test Title',
      description: '',
      type: 'text',
      voiceNotes: []
    });
  });
}); 