import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/genetic-algorithm-js-vs-rust/',
  plugins: [react()],
})
