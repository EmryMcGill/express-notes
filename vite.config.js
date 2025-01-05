import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: {
      key: './express-notes-privateKey.key',
      cert: './express-notes.crt',
    }
  },
  plugins: [
    react(),
    VitePWA({ registerType: 'autoUpdate' })
  ],
})
