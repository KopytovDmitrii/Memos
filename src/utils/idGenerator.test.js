import { describe, it, expect } from 'vitest';
import { generateMD5Hash, generateMemoId, generateVoiceNoteId } from './idGenerator.js';

describe('ID Generator', () => {
  describe('generateMD5Hash', () => {
    it('should generate consistent MD5 hash for same input', () => {
      const input = 'test data';
      const hash1 = generateMD5Hash(input);
      const hash2 = generateMD5Hash(input);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(32);
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = generateMD5Hash('test1');
      const hash2 = generateMD5Hash('test2');
      
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', () => {
      const hash = generateMD5Hash('');
      expect(hash).toBe('d41d8cd98f00b204e9800998ecf8427e');
    });
  });

  describe('generateMemoId', () => {
    it('should generate unique IDs for different memo data', () => {
      const memoData1 = { title: 'Test 1', description: 'Description 1' };
      const memoData2 = { title: 'Test 2', description: 'Description 2' };
      
      const id1 = generateMemoId(memoData1);
      const id2 = generateMemoId(memoData2);
      
      expect(id1).not.toBe(id2);
      expect(id1).toHaveLength(32);
      expect(id2).toHaveLength(32);
    });

    it('should handle memo data with empty fields', () => {
      const memoData = { title: '', description: '' };
      const id = generateMemoId(memoData);
      
      expect(id).toHaveLength(32);
    });
  });

  describe('generateVoiceNoteId', () => {
    it('should generate unique IDs for different voice note data', () => {
      const voiceNoteData1 = { title: 'Voice 1', duration: '1:30' };
      const voiceNoteData2 = { title: 'Voice 2', duration: '2:45' };
      
      const id1 = generateVoiceNoteId(voiceNoteData1);
      const id2 = generateVoiceNoteId(voiceNoteData2);
      
      expect(id1).not.toBe(id2);
      expect(id1).toHaveLength(32);
      expect(id2).toHaveLength(32);
    });

    it('should handle voice note data with empty fields', () => {
      const voiceNoteData = { title: '', duration: '' };
      const id = generateVoiceNoteId(voiceNoteData);
      
      expect(id).toHaveLength(32);
    });
  });
}); 