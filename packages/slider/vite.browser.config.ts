import { defineConfig } from "vite"

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "lib",
    minify: "terser",
    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
      fileName: "brick-slider.browser"
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
})
