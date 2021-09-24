import { resolve } from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  publicDir: './client/public',
  root:'./client',
  resolve:{
    alias: {
      '@': resolve(__dirname, './client')
    },
  },
  build:{
    outDir: 'clientBuild'
  },
  server:{
    port: 8081,
    strictPort: false,
    open: true,
    https: false,
    ssr: false,
  },
  plugins: [
    vue()
  ]
});
