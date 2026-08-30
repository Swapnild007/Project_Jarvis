import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Project_Jarvis/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
