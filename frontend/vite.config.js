import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    }
  }
})
