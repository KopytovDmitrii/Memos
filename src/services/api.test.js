import { describe, it, expect, vi, beforeEach } from 'vitest';
import { voiceEditApi } from './api';

// Мокаем fetch
global.fetch = vi.fn();

describe('voiceEditApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully edit text with voice', async () => {
    const mockResponse = {
      editedText: 'Привет, меня зовут Василий Иванович и я живу в доме номер 4123 на улице Ленина.',
      changes: { '18:28': 'Василий Иванович', '48:50': '4123' }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await voiceEditApi.editText(
      'Привет, меня зовут Иван Петров и я живу в доме номер 123 на улице Ленина.',
      'Измени имя на Василий Иванович и номер дома на 4123'
    );

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/voice-edit/edit'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalText: 'Привет, меня зовут Иван Петров и я живу в доме номер 123 на улице Ленина.',
          voiceInstruction: 'Измени имя на Василий Иванович и номер дома на 4123'
        })
      })
    );
  });

  it('should throw error when response is not ok', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await expect(voiceEditApi.editText('test', 'test')).rejects.toThrow('HTTP error! status: 500');
  });

  it('should throw error when network fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(voiceEditApi.editText('test', 'test')).rejects.toThrow('Network error');
  });
}); 