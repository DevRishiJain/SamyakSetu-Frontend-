import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// ============================================================
// API BASE URL — Change this to http://localhost:8080 for local dev
// Production EC2: http://51.21.199.205:8080
// ============================================================
const API_BASE_URL = 'http://51.21.199.205:8080'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      'transcription-bookmarks-afternoon-nights.trycloudflare.com',
    ],
  },
})
