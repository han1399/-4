import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'  // 新增：用于处理路径

// 【关键修正】在 ES Module 中获取 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue()],

   // 【新增】强制指定项目根目录为当前文件所在目录
  root: __dirname,
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // 后端地址
        changeOrigin: true,
        rewrite: (path) => path  // 保持路径不变
      }
    }
  },
  // 【新增】构建配置，显式指定入口文件
  build: {
    outDir: 'dist',  // 输出目录
    rollupOptions: {
      input: fileURLToPath(new URL('./index.html', import.meta.url))  // 明确指定入口 HTML
    }
  }

})