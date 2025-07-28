import { describe, it, expect } from 'vitest';
import { 
  formatRelativeTime, 
  truncateText, 
  isEmptyString, 
  generateDefaultTitle, 
  validateMemoData 
} from './index.js';

describe('Utils', () => {
  describe('formatRelativeTime', () => {
    it('should format recent time correctly', () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 30 * 1000); // 30 seconds ago
      
      expect(formatRelativeTime(recent.toISOString())).toBe('Только что');
    });

    it('should format minutes ago correctly', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      expect(formatRelativeTime(fiveMinutesAgo.toISOString())).toBe('5 мин назад');
    });

    it('should format hours ago correctly', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      
      expect(formatRelativeTime(twoHoursAgo.toISOString())).toBe('2 час назад');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = truncateText(longText, 20);
      
      expect(result).toBe('This is a very long ...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      const result = truncateText(shortText, 20);
      
      expect(result).toBe('Short text');
    });

    it('should handle empty string', () => {
      const result = truncateText('', 10);
      expect(result).toBe('');
    });
  });

  describe('isEmptyString', () => {
    it('should return true for empty string', () => {
      expect(isEmptyString('')).toBe(true);
    });

    it('should return true for whitespace only', () => {
      expect(isEmptyString('   ')).toBe(true);
    });

    it('should return false for non-empty string', () => {
      expect(isEmptyString('test')).toBe(false);
    });

    it('should return true for null/undefined', () => {
      expect(isEmptyString(null)).toBe(true);
      expect(isEmptyString(undefined)).toBe(true);
    });
  });

  describe('generateDefaultTitle', () => {
    it('should generate title from first line', () => {
      const content = 'First line\nSecond line\nThird line';
      const title = generateDefaultTitle(content);
      
      expect(title).toBe('First line');
    });

    it('should return default title for empty content', () => {
      const title = generateDefaultTitle('');
      expect(title).toBe('Untitled Memo');
    });

    it('should truncate long first line', () => {
      const longLine = 'A'.repeat(60);
      const title = generateDefaultTitle(longLine);
      
      expect(title).toBe('A'.repeat(50) + '...');
    });
  });

  describe('validateMemoData', () => {
    it('should validate correct memo data', () => {
      const memoData = { title: 'Test', description: 'Description' };
      const result = validateMemoData(memoData);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject memo with empty title and description', () => {
      const memoData = { title: '', description: '' };
      const result = validateMemoData(memoData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Заметка должна содержать заголовок или описание');
    });

    it('should accept memo with only title', () => {
      const memoData = { title: 'Test', description: '' };
      const result = validateMemoData(memoData);
      
      expect(result.isValid).toBe(true);
    });

    it('should accept memo with only description', () => {
      const memoData = { title: '', description: 'Test description' };
      const result = validateMemoData(memoData);
      
      expect(result.isValid).toBe(true);
    });
  });
}); 