import { defineConfig } from "vite"
import { fileURLToPath, URL } from "node:url"
import dts from "vite-plugin-dts"
// @ts-ignore
import tailwindcss from "@tailwindcss/vite"

const isLibBuild = process.env.BUILD_TARGET === "lib"

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url))
      },
      {
        find: "@sixsrc/brick-slider/api",
        replacement: fileURLToPath(new URL("./src/api.ts", import.meta.url))
      },
      {
        find: "@sixsrc/brick-slider",
        replacement: fileURLToPath(new URL("./src/index.ts", import.meta.url))
      },
      {
        find: "@sixsrc/brick-slider-accessibility",
        replacement: fileURLToPath(
          new URL("../accessibility/src/index.ts", import.meta.url)
        )
      },
      {
        find: "@sixsrc/brick-slider-stories",
        replacement: fileURLToPath(
          new URL("../stories/src/index.ts", import.meta.url)
        )
      }
    ]
  },
  define: isLibBuild
    ? { "import.meta.env.DEV": "false", "import.meta.env.PROD": "true" }
    : {},
  publicDir: isLibBuild ? false : "public",
  build: {
    outDir: "lib",
    minify: "terser",
    terserOptions: {
      compress: {
        passes: 2,
        drop_console: true,
        drop_debugger: true,
        dead_code: true,
        pure_getters: true,
        unsafe: true,
        unsafe_methods: true
      },
      mangle: {
        properties: false
      },
      format: {
        comments: false
      }
    },
    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
      fileName: "brick-slider"
    },
    rolldownOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false
      }
    }
  },
  plugins: isLibBuild
    ? [dts({ exclude: ["development/**"] })]
    : [dts({ exclude: ["development/**"] }), tailwindcss()]
})
