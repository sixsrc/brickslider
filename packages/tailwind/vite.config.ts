import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    outDir: "lib",
    minify: true,
    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
      fileName: "brick-slider-tailwind"
    },
    rollupOptions: {
      external: ["tailwindcss/plugin"]
    }
  },
  plugins: [dts()]
})
