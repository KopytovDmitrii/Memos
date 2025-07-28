export * from './idGenerator.js';

/**
 * Форматирует дату в относительное время (например, "2 часа назад")
 * @param {string} dateString - строка даты в ISO формате
 * @returns {string} отформатированное относительное время
 */
export const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'Только что';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} мин назад`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} час назад`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} дней назад`;
  }

  return date.toLocaleDateString('ru-RU');
};

/**
 * Обрезает текст до указанной длины
 * @param {string} text - исходный текст
 * @param {number} maxLength - максимальная длина
 * @returns {string} обрезанный текст
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

/**
 * Проверяет, является ли строка пустой или содержит только пробелы
 * @param {string} str - строка для проверки
 * @returns {boolean} true если строка пустая
 */
export const isEmptyString = (str) => {
  return !str || str.trim().length === 0;
};

/**
 * Создает дефолтное название для заметки
 * @param {string} content - содержимое заметки
 * @returns {string} дефолтное название
 */
export const generateDefaultTitle = (content) => {
  if (isEmptyString(content)) {
    return 'Untitled Memo';
  }
  
  const firstLine = content.split('\n')[0];
  const title = truncateText(firstLine, 50);
  return title || 'Untitled Memo';
};

/**
 * Валидирует данные заметки
 * @param {Object} memoData - данные заметки
 * @returns {Object} результат валидации
 */
export const validateMemoData = (memoData) => {
  const errors = [];
  
  if (isEmptyString(memoData.title) && isEmptyString(memoData.description)) {
    errors.push('Заметка должна содержать заголовок или описание');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 