import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { compression } from "vite-plugin-compression2";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({
      algorithm: "gzip",
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    compression({
      algorithm: "brotliCompress",
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
  ],
  server: {
    compress: true,
    headers: {
      "Cache-Control": "public, max-age=31536000",
    },
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
  },
  build: {
    // Enable tree shaking and minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          "react-core": ["react", "react-dom"],
          // Routing
          "react-router": ["react-router-dom"],
          // UI libraries
          "ui-libs": ["react-icons", "react-hook-form"],
          // External services
          "external-services": [
            "@google/generative-ai",
            "@stripe/stripe-js",
            "@stripe/react-stripe-js",
          ],
          // Utilities
          utils: ["axios", "date-fns"],
          // Markdown rendering
          markdown: ["react-markdown"],
        },
        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId
                .split("/")
                .pop()
                .replace(/\.[^/.]+$/, "")
            : "chunk";
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // Optimize build performance
    target: "es2015",
    sourcemap: false,
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-icons",
      "react-hook-form",
    ],
  },
});
