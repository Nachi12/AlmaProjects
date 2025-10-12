import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "localhost",
    port: 5173,
    proxy: {
      "/api": {
        target:
          "https://alma-projects-eig5g792i-nachiketa-nrs-projects.vercel.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
    build: {
      outDir: "dist",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.js",
    css: true,
    include: ["src/**/*.test.{js,jsx,ts,tsx}"],
    exclude: ["backend/**/*", "node_modules/**/*", "dist/**/*"],
  },
});
