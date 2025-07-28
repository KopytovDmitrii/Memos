// Глобальные настройки для тестов
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Мокаем IndexedDB
global.indexedDB = {
  open: vi.fn(),
};

// Мокаем window.confirm
global.confirm = vi.fn();

// Мокаем console методы
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}; 