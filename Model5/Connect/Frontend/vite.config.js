const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react-swc");
const path = require("path");

module.exports = defineConfig({
  server: {
    host: "localhost", // local only
    port: 5173,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
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
