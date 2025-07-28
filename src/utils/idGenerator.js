import CryptoJS from 'crypto-js';

/**
 * Генерирует MD5 хэш на основе входных данных
 * @param {string} data - данные для хэширования
 * @returns {string} MD5 хэш в виде строки
 */
export const generateMD5Hash = (data) => {
  return CryptoJS.MD5(data).toString();
};

/**
 * Генерирует уникальный ID для заметки
 * @param {Object} memoData - данные заметки
 * @returns {string} уникальный ID
 */
export const generateMemoId = (memoData) => {
  const timestamp = Date.now().toString();
  const title = memoData.title || '';
  const description = memoData.description || '';
  const data = `${timestamp}-${title}-${description}`;
  
  return generateMD5Hash(data);
};

/**
 * Генерирует уникальный ID для голосовой заметки
 * @param {Object} voiceNoteData - данные голосовой заметки
 * @returns {string} уникальный ID
 */
export const generateVoiceNoteId = (voiceNoteData) => {
  const timestamp = Date.now().toString();
  const title = voiceNoteData.title || '';
  const duration = voiceNoteData.duration || '';
  const data = `${timestamp}-${title}-${duration}`;
  
  return generateMD5Hash(data);
}; 