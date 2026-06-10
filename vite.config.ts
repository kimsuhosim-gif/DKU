import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = path.resolve(__dirname, '.');

export default defineConfig({
  root: projectRoot,
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': projectRoot,
    }
  }
});
