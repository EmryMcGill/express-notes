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
    VitePWA({ 
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      registerType: 'autoUpdate',
      manifest: {
        name: 'Expresso Notes',
        short_name: 'Expresso',
        description: 'simple note app',
        theme_color: '#35A6EF',
        start_url:"/app",
        icons: [
          {
            src: '/icons/16.png',
            sizes: '16x16',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/32.png',
            sizes: '32x32',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/180.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
