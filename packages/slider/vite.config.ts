import { defineConfig } from "vite"
import { resolve } from "path"
import dts from "vite-plugin-dts"
import { ViteMinifyPlugin } from "vite-plugin-minify"
// @ts-ignore
import tailwindcss from "@tailwindcss/vite"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src")
      }
    ]
  },
  build: {
    minify: true,
    lib: {
      name: "BrickSlider",
      entry: "./src/index.ts",
      formats: ["es", "cjs", "umd"],
      fileName: "brick-slider"
    },
    rollupOptions: {
      plugins: [nodeResolve(), commonjs()],
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false
      }
    }
  },
  plugins: [dts(), tailwindcss(), ViteMinifyPlugin()]
})
