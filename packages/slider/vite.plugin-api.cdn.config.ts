import { defineConfig } from "vite"
import { ViteMinifyPlugin } from "vite-plugin-minify"

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "lib",
    minify: true,
    lib: {
      name: "BrickSliderPluginApi",
      entry: "./src/plugin-api.ts",
      formats: ["umd"],
      fileName: "plugin-api"
    },
    rolldownOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false
      }
    }
  },
  plugins: [ViteMinifyPlugin()]
})
