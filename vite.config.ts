import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src')
      }
    ]
  },
  build: {
    lib: {
      name: 'BrickSlider',
      entry: './src/index.ts',
      formats: ['es', 'cjs', 'umd'],
      fileName: 'brick-slider'
    }
  },
  plugins: [dts()]
})
