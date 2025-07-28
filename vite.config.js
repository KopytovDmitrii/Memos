import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения
  const env = loadEnv(mode, process.cwd(), '')
  
  const voiceEditEnabled = env.VOICE_EDIT === 'true'
  
  return {
    plugins: [react()],
    define: {
      __VOICE_EDIT_ENABLED__: JSON.stringify(voiceEditEnabled)
    },
    test: {
      globals: true,
      environment: 'jsdom'
    }
  }
}) 