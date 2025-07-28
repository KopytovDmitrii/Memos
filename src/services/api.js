import { config } from '../../config.js';

const baseUrl = config.baseUrl;

export const voiceEditApi = {
  async editText(originalText, voiceInstruction, signal) {
    try {
      const response = await fetch(`${baseUrl}/voice-edit/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalText,
          voiceInstruction,
        }),
        signal, // Добавляем AbortSignal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error editing text with voice:', error);
      throw error;
    }
  },
}; 