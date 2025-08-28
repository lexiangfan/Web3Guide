import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'


export default defineConfig({
  base: '/Web3Guide/',
  plugins: [
      vue(),

  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server:{
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将第三方库单独打包
          'element-plus': ['element-plus'],
          // 将较大的工具库单独打包
          'vue-libraries': ['vue', 'vue-router'],
        }
      }
    },
    chunkSizeWarningLimit: 1000 // 调整警告阈值到1000kB
  }
})
