import { defineConfig } from 'vite'
import { splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [splitVendorChunkPlugin(), react()],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: './src/main.jsx',
        pomodoro: './src/routes/pages/Pomodoro/Pomodoro.jsx',
        dashboard: './src/routes/pages/DashBoard/Dashboard.jsx',
        errorPage: './src/routes/Erro-page.jsx',
      },
      external: [
        'react',
        'react-dom',
        'react-router-dom',
        'react-query',
        'react-modal',
        'react-icons',
        'react-toastify',
        'react-router-dom',
      ],
    }
  }
})
