import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "lib",
    minify: true,
    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
      fileName: "brick-slider-stories"
    },
    rollupOptions: {
      external: ["@sixsrc/brick-slider", "@sixsrc/brick-slider/api"]
    }
  },
  plugins: [dts()]
})
