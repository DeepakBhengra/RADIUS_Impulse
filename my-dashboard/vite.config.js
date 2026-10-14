import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
 
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '10.129.180.117',
    port: 5173,
    strictPort: true,
  },
})
