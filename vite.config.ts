import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue()],
    resolve: {
      dedupe: ['vue']
    },
    optimizeDeps: {
      exclude: ['firebase/app', 'firebase/auth', 'firebase/firestore']
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    define: {
      'import.meta.env.VITE_MAPBOX_TOKEN': JSON.stringify(env.VITE_MAPBOX_TOKEN)
    }
  }
})

