import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/TST-Final-Project-JeremyD/',
  server: {
    proxy: {
      '/edit-image': {
        target: 'https://tst-final-project-jeremyd-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
