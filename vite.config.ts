import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({ autoCodeSplitting: true }), viteReact()],
  // Test configuration should be in vitest.config.js
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
})
