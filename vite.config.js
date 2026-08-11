import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        forgotPassword: resolve(__dirname, 'forgot-password.html'),
        resetPin: resolve(__dirname, 'reset-pin.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        woDetail: resolve(__dirname, 'wo-detail.html'),
        success: resolve(__dirname, 'success.html'),
      },
    },
  },
})