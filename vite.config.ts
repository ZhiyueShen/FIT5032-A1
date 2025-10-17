import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@firebase': path.resolve(__dirname, 'node_modules/firebase'),
      'firebase': path.resolve(__dirname, 'node_modules/firebase')
    },
    dedupe: ['vue', 'firebase']
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  build: {
    rollupOptions: {
      external: ['firebase', 'firebase/auth', 'firebase/app', 'firebase/firestore'] // ✅ 加这一行
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
