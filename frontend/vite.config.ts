import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // 你的后端服务器地址
        changeOrigin: true, // 更改请求头中的Origin字段
        secure: false, // 如果后端使用的是http而不是https，可以设置为false
      },
    },
  },
});
