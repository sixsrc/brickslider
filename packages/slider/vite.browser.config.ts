import { defineConfig } from "vite"

export default defineConfig({
  publicDir: false,
  define: { "import.meta.env.DEV": "false", "import.meta.env.PROD": "true" },
  build: {
    outDir: "lib",
    minify: "terser",
    terserOptions: {
      module: false,
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
      entry: "./src/browser.ts",
      formats: ["iife"],
      name: "BrickSliderBundle",
      fileName: () => "brick-slider.browser.js"
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false
      }
    }
  }
})
