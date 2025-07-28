import { config } from '../../config.js'

/**
 * Хук для работы с конфигурацией приложения
 * @returns {Object} Объект с настройками приложения
 */
export const useConfig = () => {
  return {
    voiceEdit: config.voiceEdit
  }
} 