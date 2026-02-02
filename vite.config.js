import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Разрешаем этот конкретный хост для ngrok
    allowedHosts: [
      'tawanda-coachable-charlena.ngrok-free.dev'
    ]
  }
})