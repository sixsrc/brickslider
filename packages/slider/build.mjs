import { cp, mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const currentDir = dirname(fileURLToPath(import.meta.url))
const libDir = resolve(currentDir, "lib")
const sourceCss = resolve(currentDir, "styles/brick-slider.css")
const targetCss = resolve(libDir, "brick-slider.css")
const packageJsonPath = resolve(currentDir, "package.json")

const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"))
const currentYear = new Date().getFullYear()
const repoUrl = String(packageJson.repository?.url ?? "")
  .replace(/^git\+/, "")
  .replace(/^https?:\/\//, "")
  .replace(/\.git$/, "")

const banner = `/*
 * BrickSlider
 * Version  : ${packageJson.version}
 * License  : ${packageJson.license}
 * Copyright: ${currentYear}
 * Repo: ${repoUrl}
 */

`

async function injectBanner(fileName) {
  const filePath = resolve(libDir, fileName)
  const currentContent = await readFile(filePath, "utf8")

  if (currentContent.startsWith("/*\n * BrickSlider\n")) return

  await writeFile(filePath, `${banner}${currentContent}`, "utf8")
}

await mkdir(libDir, { recursive: true })
await cp(sourceCss, targetCss)
await injectBanner("brick-slider.js")
await injectBanner("brick-slider.browser.js")
await injectBanner("api.js")
