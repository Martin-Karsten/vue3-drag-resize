import { resolve } from "node:path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";

export default defineConfig({
  // If our .vue files have a style, it will be compiled as a single `.css` file under /dist.
  plugins: [Vue()],

  build: {
    outDir: "./dist",
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "vue3-drag-resize",
      fileName: (format) => `${"vue3-drag-resize"}.${format}.js`,
    },
    rollupOptions: {
      // Vue is provided by the parent project, don't compile Vue source-code inside our library.
      external: ["vue"],
      output: { globals: { vue: "Vue" } },
    },
  },
});
