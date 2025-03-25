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
        target:
          "http://aa09e3ae27a144cd0aaf0fbce7f0ab1c-bcccf20eeb9b21bd.elb.ap-south-1.amazonaws.com",
        changeOrigin: true,
        secure: false, // Since backend doesn't have SSL
        rewrite: (path) => path.replace(/^\/api/, ""), // Ensure proper request forwarding
      },
    },
  },
});
