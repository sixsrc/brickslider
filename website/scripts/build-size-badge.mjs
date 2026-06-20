import { gzipSync } from "node:zlib"
import { mkdir, readFile, writeFile } from "node:fs/promises"

const INPUT_FILE = "packages/slider/lib/brick-slider.js"
const OUTPUT_FILE = "website/badges/brick-slider-size.json"
const BYTE_TO_KB = 1024

function formatKilobytes(bytes) {
  return `${(bytes / BYTE_TO_KB).toFixed(2)} kB`
}

const bundle = await readFile(INPUT_FILE)
const gzipSize = gzipSync(bundle).length

const badge = {
  schemaVersion: 1,
  label: "core gzip",
  message: formatKilobytes(gzipSize),
  color: "A855F7"
}

await mkdir("website/badges", { recursive: true })
await writeFile(OUTPUT_FILE, `${JSON.stringify(badge, null, 2)}\n`)

console.log(`[badge] ${badge.label}: ${badge.message}`)
