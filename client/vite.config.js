import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
  ],
  server: {
    proxy: {
      // '/api': 'http://localhost:3000', // Change 5000 to your backend port if different
      '/api': 'https://guidopia-v2-backend.vercel.app', // Change 5000 to your backend port if different
    },
  },
})
