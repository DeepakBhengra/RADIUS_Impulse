import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
 
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '10.24.169.28',
    port: 7010,
    strictPort: true,
  },
})
