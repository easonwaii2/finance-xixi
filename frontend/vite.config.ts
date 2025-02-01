import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: ["devin-ai-app-tunnel-ut5g8jou.devinapps.com"],
    proxy: {
      "/api/v1": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
