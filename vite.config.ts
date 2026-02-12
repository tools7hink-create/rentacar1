import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Replace 'prestige-motors' with your exact GitHub repository name
  base: '/prestige-motors/', 
  build: {
    outDir: 'dist',
  }
})