// Конфигурация приложения
export const config = {
  // Включить/выключить функциональность редактирования голосом
  voiceEdit: import.meta.env.VITE_VOICE_EDIT === 'true' || false,
  // Базовый URL для API
  baseUrl: import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
} 