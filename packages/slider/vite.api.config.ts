import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "lib",
    minify: true,
    lib: {
      entry: "./src/api.ts",
      formats: ["es"],
      fileName: "api"
    },
    rolldownOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false
      }
    }
  },
  plugins: [dts({ exclude: ["development/**"] })]
})
