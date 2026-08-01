import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige toutes les requêtes commençant par /api vers ton backend
      '/api': {
        target: 'http://localhost:5000', // 👈 REMPLACE 5000 par le port de ton serveur backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})