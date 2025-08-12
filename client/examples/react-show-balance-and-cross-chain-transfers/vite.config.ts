import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  define: {
    // Polyfill Node.js globals for browser environment
    global: "globalThis",
    "process.env": {},
  },
  resolve: {
    alias: {
      // Polyfill Node.js modules
      process: "process/browser",
      util: "util",
    },
  },
  optimizeDeps: {
    include: ["process", "util"],
  },
});
