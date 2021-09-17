import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve('src'),
      '@img': resolve('src/assets/img'),
      '@style': resolve('src/assets/style'),
      '@js': resolve('src/assets/js'),
      '@ts': resolve('src/assets/ts'),
      '@fonts': resolve('src/assets/fonts'),
      '@css': resolve('src/assets/css'),
      '@libs': resolve('src/libs'),
      '@com': resolve('src/components'),
      '@views': resolve('src/views'),
      '@plugins': resolve('src/plugins')
    }
  },
  base: './', // 打包路径
  server: {
    port: 3000, // 服务端口号
    open: true, // 服务启动时是否自动打开浏览器
    cors: true // 允许跨域
  }
})
