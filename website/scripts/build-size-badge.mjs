import { mkdir, writeFile } from "node:fs/promises"

const OUTPUT_FILE = "website/badges/brick-slider-size.json"
const BUNDLE_GZIP_SIZE = "12.7 kB"

const badge = {
  schemaVersion: 1,
  label: "gzip",
  message: BUNDLE_GZIP_SIZE,
  color: "A855F7"
}

await mkdir("website/badges", { recursive: true })
await writeFile(OUTPUT_FILE, `${JSON.stringify(badge, null, 2)}\n`)

console.log(`[badge] ${badge.label}: ${badge.message}`)
