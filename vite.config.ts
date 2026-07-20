import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/football': {
        target: 'https://api.football-data.org',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api\/football/, ''),
      },
      '/api/newsapi': {
        target: 'https://newsapi.org/v2',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/newsapi/, ''),
      },
    },
  },
  preview: {
    proxy: {
      '/api/football': {
        target: 'https://api.football-data.org',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api\/football/, ''),
      },
      '/api/newsapi': {
        target: 'https://newsapi.org/v2',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/newsapi/, ''),
      },
    },
  },
})
