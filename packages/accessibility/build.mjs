import { readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const currentDir = dirname(fileURLToPath(import.meta.url))
const libDir = resolve(currentDir, "lib")
const packageJsonPath = resolve(currentDir, "package.json")

const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"))
const currentYear = new Date().getFullYear()
const repoUrl = String(packageJson.repository?.url ?? "")
  .replace(/^git\+/, "")
  .replace(/^https?:\/\//, "")
  .replace(/\.git$/, "")

const banner = `/*
 * BrickSliderAccessibility
 * Version  : ${packageJson.version}
 * License  : ${packageJson.license}
 * Copyright: ${currentYear}
 * Repo: ${repoUrl}
 */

`

async function injectBanner(fileName) {
  const filePath = resolve(libDir, fileName)
  const currentContent = await readFile(filePath, "utf8")
  const nextContent = currentContent.replace(/^\/\*[\s\S]*?\*\/\n*/, "")

  await writeFile(filePath, `${banner}${nextContent}`, "utf8")
}

await injectBanner("brick-slider-accessibility.js")
await injectBanner("brick-slider-accessibility.browser.js")
