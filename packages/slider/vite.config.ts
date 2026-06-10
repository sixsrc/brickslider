import { defineConfig } from "vite"
import { fileURLToPath, URL } from "node:url"
import dts from "vite-plugin-dts"
import { ViteMinifyPlugin } from "vite-plugin-minify"
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
        find: "@sixsrc/brick-slider/plugin-api",
        replacement: fileURLToPath(new URL("./src/plugin-api.ts", import.meta.url))
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
  // Elimina o bloco `if (import.meta.env.DEV)` do bundle da lib
  define: isLibBuild
    ? { "import.meta.env.DEV": "false", "import.meta.env.PROD": "true" }
    : {},
  // impede que public/ (vídeos/imagens de demo) vá pra lib/ durante o build da lib
  publicDir: isLibBuild ? false : "public",
  build: {
    outDir: "lib",
    minify: "terser",
    terserOptions: {
      compress: {
        passes: 3,          // múltiplas passagens de compressão
        drop_console: true, // remove console.* do bundle
        drop_debugger: true,
        dead_code: true,
        pure_getters: true,
        unsafe_methods: true,
        pure_funcs: ["console.log", "console.warn", "console.error"]
      },
      mangle: {
        properties: false   // não mangle props públicas (quebraria a API)
      },
      format: {
        comments: false     // remove todos os comentários incluindo #region
      }
    },
    lib: {
      name: "BrickSlider",
      entry: "./src/index.ts",
      formats: ["es", "cjs"],
      fileName: "brick-slider"
    },
    rolldownOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false
      }
    }
  },
  // tailwindcss() só para dev server, não para build da lib
  plugins: isLibBuild
    ? [dts(), ViteMinifyPlugin()]
    : [dts(), tailwindcss(), ViteMinifyPlugin()]
})
