import { describe, it, expect, beforeEach, vi } from 'vitest';
import memoService from './memoService.js';

// Мокаем IndexedDB
const mockIndexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn()
};

const mockRequest = {
  onerror: null,
  onsuccess: null,
  onupgradeneeded: null,
  result: { 
    objectStoreNames: { contains: vi.fn() },
    transaction: vi.fn()
  }
};

const mockTransaction = {
  objectStore: vi.fn()
};

const mockStore = {
  add: vi.fn(),
  put: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
  getAll: vi.fn(),
  createIndex: vi.fn()
};

describe('MemoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Настройка моков
    global.indexedDB = mockIndexedDB;
    mockIndexedDB.open.mockReturnValue(mockRequest);
    mockRequest.result.transaction.mockReturnValue(mockTransaction);
    mockTransaction.objectStore.mockReturnValue(mockStore);
    
    // Сброс состояния сервиса
    memoService.db = null;
  });

  describe('initDB', () => {
    it('should initialize database successfully', async () => {
      mockRequest.result.objectStoreNames.contains.mockReturnValue(false);
      
      const promise = memoService.initDB();
      
      // Эмулируем успешное открытие БД
      if (mockRequest.onsuccess) {
        mockRequest.onsuccess();
      }
      
      const result = await promise;
      
      expect(global.indexedDB.open).toHaveBeenCalledWith('VoiceMemosDB', 2);
      expect(result).toBe(mockRequest.result);
    });

    it('should handle database initialization error', async () => {
      const error = new Error('Database error');
      mockRequest.error = error;
      
      const promise = memoService.initDB();
      
      // Эмулируем ошибку БД
      if (mockRequest.onerror) {
        mockRequest.onerror();
      }
      
      await expect(promise).rejects.toThrow('Database error');
    });
  });

  describe('createMemo', () => {
    it('should create memo successfully', async () => {
      // Устанавливаем БД напрямую
      memoService.db = mockRequest.result;
      
      const memoData = {
        title: 'Test Memo',
        description: 'Test content',
        type: 'text'
      };
      
      mockStore.add.mockImplementation((memo) => {
        const request = {
          onerror: null,
          onsuccess: null,
          result: memo.id // Возвращаем ID из переданного объекта
        };
        
        // Эмулируем успешное добавление
        setTimeout(() => {
          if (request.onsuccess) {
            request.onsuccess();
          }
        }, 0);
        
        return request;
      });
      
      const result = await memoService.createMemo(memoData);
      
      expect(result).toEqual(
        expect.objectContaining({
          title: 'Test Memo',
          description: 'Test content',
          type: 'text',
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      );
      
      // Проверяем, что ID был сгенерирован
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
    });
  });

  describe('updateMemo', () => {
    it('should update memo successfully', async () => {
      // Устанавливаем БД напрямую
      memoService.db = mockRequest.result;
      
      const existingMemo = {
        id: 'test-id',
        title: 'Old Title',
        description: 'Old content',
        type: 'text',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };
      
      const updateData = {
        title: 'New Title',
        description: 'New content'
      };
      
      mockStore.get.mockImplementation(() => {
        const request = {
          onerror: null,
          onsuccess: null,
          result: existingMemo
        };
        
        // Эмулируем успешное получение
        setTimeout(() => {
          if (request.onsuccess) {
            request.onsuccess();
          }
        }, 0);
        
        return request;
      });
      
      mockStore.put.mockImplementation(() => {
        const request = {
          onerror: null,
          onsuccess: null
        };
        
        // Эмулируем успешное обновление
        setTimeout(() => {
          if (request.onsuccess) {
            request.onsuccess();
          }
        }, 0);
        
        return request;
      });
      
      const result = await memoService.updateMemo('test-id', updateData);
      
      expect(result).toEqual(
        expect.objectContaining({
          id: 'test-id',
          title: 'New Title',
          description: 'New content',
          type: 'text'
        })
      );
    });

    it('should handle memo not found error', async () => {
      // Устанавливаем БД напрямую
      memoService.db = mockRequest.result;
      
      mockStore.get.mockImplementation(() => {
        const request = {
          onerror: null,
          onsuccess: null,
          result: null
        };
        
        // Эмулируем успешное получение с null результатом
        setTimeout(() => {
          if (request.onsuccess) {
            request.onsuccess();
          }
        }, 0);
        
        return request;
      });
      
      await expect(memoService.updateMemo('non-existent', {})).rejects.toThrow('Memo not found');
    });
  });

  describe('deleteMemo', () => {
    it('should delete memo successfully', async () => {
      // Устанавливаем БД напрямую
      memoService.db = mockRequest.result;
      
      mockStore.delete.mockImplementation(() => {
        const request = {
          onerror: null,
          onsuccess: null
        };
        
        // Эмулируем успешное удаление
        setTimeout(() => {
          if (request.onsuccess) {
            request.onsuccess();
          }
        }, 0);
        
        return request;
      });
      
      await expect(memoService.deleteMemo('test-id')).resolves.toBeUndefined();
    });
  });

  describe('getAllMemos', () => {
    it('should return all memos sorted by creation date', async () => {
      // Устанавливаем БД напрямую
      memoService.db = mockRequest.result;
      
      const memos = [
        { id: '1', title: 'First', createdAt: '2023-01-01T00:00:00.000Z' },
        { id: '2', title: 'Second', createdAt: '2023-01-02T00:00:00.000Z' }
      ];
      
      mockStore.getAll.mockImplementation(() => {
        const request = {
          onerror: null,
          onsuccess: null,
          result: memos
        };
        
        // Эмулируем успешное получение всех записей
        setTimeout(() => {
          if (request.onsuccess) {
            request.onsuccess();
          }
        }, 0);
        
        return request;
      });
      
      const result = await memoService.getAllMemos();
      
      expect(result).toEqual([
        { id: '2', title: 'Second', createdAt: '2023-01-02T00:00:00.000Z' },
        { id: '1', title: 'First', createdAt: '2023-01-01T00:00:00.000Z' }
      ]);
    });
  });
}); 