import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Specify which Node.js globals and modules to polyfill
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Include specific modules
      include: [
        "util",
        "crypto",
        "stream",
        "buffer",
        "events",
        "string_decoder",
      ],
      // Exclude optional native dependencies
      exclude: [],
    }),
    // Plugin to stub optional native dependencies
    {
      name: "stub-optional-deps",
      enforce: "pre", // Run before other plugins
      resolveId(id) {
        // Stub out optional native dependencies that don't work in browser
        if (id === "bufferutil" || id === "utf-8-validate") {
          return `\0${id}`; // Virtual module ID
        }
        return null;
      },
      load(id) {
        // Return empty module for optional dependencies
        if (id === "\0bufferutil" || id === "\0utf-8-validate") {
          return "export default {};";
        }
        return null;
      },
    },
  ],
  define: {
    global: "globalThis",
    "process.env": {},
    "process.browser": JSON.stringify(true),
    "process.version": JSON.stringify("v16.0.0"),
  },
  resolve: {
    alias: {
      process: "process/browser",
      util: "util",
      crypto: "crypto-browserify",
      stream: "stream-browserify",
    },
  },
  optimizeDeps: {
    include: ["process", "util", "crypto-browserify", "stream-browserify"],
    exclude: ["bufferutil", "utf-8-validate"],
  },
});
