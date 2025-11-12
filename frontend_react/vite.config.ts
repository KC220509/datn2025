import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'hotrodoan', 
    port: 5173,     
    strictPort: true, //Giúp port không bị đổi khi bị trùng
  },
})
