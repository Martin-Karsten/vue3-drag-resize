import { resolve } from "node:path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";

export default defineConfig({
  // If our .vue files have a style, it will be compiled as a single `.css` file under /dist.
  plugins: [Vue()],

  build: {
    // Output compiled files to /dist.
    outDir: "./dist",
    lib: {
      // Set the entry point (file that contains our components exported).
      entry: resolve(__dirname, "src/index.ts"),
      // Name of the library.
      name: "vue3-drag-resize",
      // We are building for CJS and ESM, use a function to rename automatically files.
      // Example: vue3-drag-resize.esm.js
      fileName: (format) => `${"vue3-drag-resize"}.${format}.js`,
    },
    rollupOptions: {
      // Vue is provided by the parent project, don't compile Vue source-code inside our library.
      external: ["vue"],
      output: { globals: { vue: "Vue" } },
    },
  },
});
