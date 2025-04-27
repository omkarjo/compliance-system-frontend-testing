import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.NODE_ENV !== "development" 
          ? "http://localhost:8000/" // Local FastAPI server
          : "https://ajvc-compliance-system.com/",
        changeOrigin: true,
        secure: false, // Since backend doesn't have SSL
        rewrite: (path) => path.replace(/^\/api/, ""), // Ensure proper request forwarding
      },
    },
  },
});
