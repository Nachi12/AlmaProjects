import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
   base: "./",
  server: {
    host: "localhost",
    port: 5173,
  },
  server: {
    host: "localhost",
    port: 5173,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
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
