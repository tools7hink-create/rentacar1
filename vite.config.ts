import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    // IMPORTANT: Replace 'prestige-motors' with your exact GitHub repository name
    base: '/prestige-motors/', 
    build: {
      outDir: 'dist',
    },
    define: {
      // This polyfills 'process.env.API_KEY' in your source code 
      // with the value of VITE_API_KEY from your .env file
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || '')
    }
  }
})