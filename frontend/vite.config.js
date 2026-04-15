import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173,
    proxy: {
      '/check': 'http://127.0.0.1:5000',
      '/check_email': 'http://127.0.0.1:5000',
      '/history': 'http://127.0.0.1:5000'
    }
  }
})
