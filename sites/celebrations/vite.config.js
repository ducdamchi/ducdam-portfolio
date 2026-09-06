import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', routesDirectory: './src/routes' }),
    react(),
    tailwindcss(),
  ],
  base: '/',
  server: { port: 5174, strictPort: true },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ducdam/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
})
