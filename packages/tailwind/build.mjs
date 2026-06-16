import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const libDir = resolve(currentDir, 'lib')
const sourceCss = resolve(currentDir, 'src/preset.css')
const targetCss = resolve(libDir, 'preset.css')
const sourceStructuralCss = resolve(currentDir, '../slider/styles/brick-slider.css')
const targetStructuralCss = resolve(libDir, 'brick-slider.css')
const packageJsonPath = resolve(currentDir, 'package.json')

const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
const currentYear = new Date().getFullYear()
const repoUrl = String(packageJson.repository?.url ?? '')
  .replace(/^git\+/, '')
  .replace(/^https?:\/\//, '')
  .replace(/\.git$/, '')

const banner = `/*
 * BrickSlider Tailwind
 * Version  : ${packageJson.version}
 * License  : ${packageJson.license}
 * Copyright: ${currentYear}
 * Repo: ${repoUrl}
 */

`

async function injectBanner(fileName) {
  const filePath = resolve(libDir, fileName)
  const currentContent = await readFile(filePath, 'utf8')

  if (currentContent.startsWith('/*\n * BrickSlider Tailwind\n')) return

  await writeFile(filePath, `${banner}${currentContent}`, 'utf8')
}

await mkdir(libDir, { recursive: true })
await cp(sourceCss, targetCss)
await cp(sourceStructuralCss, targetStructuralCss)
await injectBanner('brick-slider-tailwind.js')
