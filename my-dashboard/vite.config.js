import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
 
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '192.168.31.102',
    port: 5173,
    strictPort: true,
  },
})
