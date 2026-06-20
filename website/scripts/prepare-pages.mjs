import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { extname, join } from "node:path"
import { readdirSync, statSync } from "node:fs"

const SITE_BASE = "/brickslider"
const SOURCE_DIR = "website"
const OUTPUT_DIR = "website-dist"
const REWRITE_EXTENSIONS = new Set([".html", ".js", ".css"])
const SKIP_DIRECTORIES = new Set(["content", "scripts"])

async function copyWebsite() {
  await rm(OUTPUT_DIR, { recursive: true, force: true })
  await mkdir(OUTPUT_DIR, { recursive: true })

  const entries = readdirSync(SOURCE_DIR)

  for (const entry of entries) {
    if (SKIP_DIRECTORIES.has(entry)) continue

    await cp(join(SOURCE_DIR, entry), join(OUTPUT_DIR, entry), {
      recursive: true,
      force: true
    })
  }
}

function walkFiles(directory) {
  const files = []

  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry)
    const stat = statSync(path)

    if (stat.isDirectory()) {
      files.push(...walkFiles(path))
      continue
    }

    files.push(path)
  }

  return files
}

function rewriteRootPaths(content) {
  return content
    .replace(/(href|src)=["']\/(?!\/|brickslider\/)([^"']*)["']/g, `$1="${SITE_BASE}/$2"`)
    .replace(/fetch\(["']\/(?!\/|brickslider\/)([^"']*)["']/g, `fetch("${SITE_BASE}/$1"`)
    .replace(/location\.replace\(["']\/(?!\/|brickslider\/)([^"']*)["']/g, `location.replace("${SITE_BASE}/$1"`)
}

async function rewriteFiles() {
  const files = walkFiles(OUTPUT_DIR).filter(file => REWRITE_EXTENSIONS.has(extname(file)))

  for (const file of files) {
    const content = await readFile(file, "utf8")
    const rewritten = rewriteRootPaths(content)

    if (rewritten !== content) {
      await writeFile(file, rewritten)
    }
  }
}

await copyWebsite()
await rewriteFiles()

console.log(`[pages] prepared ${OUTPUT_DIR} for ${SITE_BASE}`)
