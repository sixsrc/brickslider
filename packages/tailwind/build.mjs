import { cp, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const libDir = resolve(currentDir, 'lib')
const sourceCss = resolve(currentDir, 'src/preset.css')
const targetCss = resolve(libDir, 'preset.css')
const sourceStructuralCss = resolve(currentDir, 'src/brick-slider.css')
const targetStructuralCss = resolve(libDir, 'brick-slider.css')

await mkdir(libDir, { recursive: true })
await cp(sourceCss, targetCss)
await cp(sourceStructuralCss, targetStructuralCss)
