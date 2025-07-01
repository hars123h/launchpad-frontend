// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:7100",
    //     changeOrigin: true, // optional but recommended
    //   },
    // },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js", // make sure file exists
    css: true, // if using Tailwind or importing CSS
    mockReset: true, // helpful for isolated mocking
  },
});
