import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "lib",
    minify: "terser",
    terserOptions: {
      module: true,
      toplevel: true,
      compress: {
        passes: 3,
        drop_console: true,
        drop_debugger: true,
        dead_code: true,
        pure_getters: true,
        unsafe: true,
        unsafe_methods: true,
        booleans_as_integers: true,
        ecma: 2020
      },
      mangle: {
        toplevel: true,
        properties: false
      },
      format: {
        comments: false
      }
    },
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
