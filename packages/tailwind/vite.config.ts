import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    outDir: "lib",
    minify: true,
    lib: {
      name: "BrickSliderTailwind",
      entry: "./src/index.ts",
      formats: ["es", "cjs"],
      fileName: "brick-slider-tailwind"
    },
    rollupOptions: {
      external: ["tailwindcss/plugin"],
      output: {
        exports: "named"
      }
    }
  },
  plugins: [dts()]
})
