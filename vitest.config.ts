import { defineConfig } from 'vitest/config'
import { mergeConfig } from 'vite'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ['__tests__/*.{test,spec}.{js,ts,jsx,tsx}']
    }
  })
)
