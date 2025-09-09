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
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'query-vendor': ['@tanstack/react-query'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Large components
          'pdf-viewer': ['pdfjs-dist'],
          'chart-lib': ['recharts'],
          'table-lib': ['@tanstack/react-table'],
          'date-lib': ['date-fns'],
          
          // Business logic chunks
          'dashboard-core': [
            './src/pages/Dashboard/Overview/DashBoard.jsx',
            './src/components/business/tasks',
            './src/components/business/funds'
          ]
        }
      }
    }
  },
  server: {
    proxy: {
      "/api": {
        target:
          process.env.NODE_ENV !== "development"
            ? "http://localhost:8000/" // Local FastAPI server
            : "https://ajvc-compliance-system.com/",
        changeOrigin: true,
        secure: false, // Since backend doesn't have SSL
        rewrite: (path) => path.replace(/^\/api/, ""), // Ensure proper request forwarding
      },
    },
  },
});
