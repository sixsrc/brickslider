import { mkdir, readFile, writeFile } from "node:fs/promises"

const PACKAGE_FILE = "packages/slider/package.json"
const OUTPUT_FILE = "website/badges/brick-slider-size.json"
const BYTE_TO_KB = 1024
const FALLBACK_MESSAGE = "12.7 kB"
const isCi = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true"
const RETRY_COUNT = 5
const RETRY_DELAY = 2500

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function formatKilobytes(bytes) {
  return `${(bytes / BYTE_TO_KB).toFixed(1)} kB`
}

async function readPreviousMessage() {
  try {
    const previousBadge = JSON.parse(await readFile(OUTPUT_FILE, "utf8"))

    return typeof previousBadge.message === "string"
      ? previousBadge.message
      : undefined
  } catch {
    return undefined
  }
}

async function getBundlephobiaGzipSize(packageSpec) {
  const url = `https://bundlephobia.com/api/size?package=${encodeURIComponent(packageSpec)}`
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "brickslider-size-badge"
    }
  })

  if (!response.ok) {
    throw new Error(`Bundlephobia responded with ${response.status}`)
  }

  const payload = await response.json()

  if (typeof payload.gzip !== "number") {
    throw new Error("Bundlephobia response is missing gzip size")
  }

  return payload.gzip
}

async function getBundlephobiaGzipSizeWithRetry(packageSpec) {
  let lastError

  for (let attempt = 1; attempt <= RETRY_COUNT; attempt += 1) {
    try {
      return await getBundlephobiaGzipSize(packageSpec)
    } catch (error) {
      lastError = error

      if (attempt < RETRY_COUNT) {
        await wait(RETRY_DELAY)
      }
    }
  }

  throw lastError
}

const packageJson = JSON.parse(await readFile(PACKAGE_FILE, "utf8"))
const packageSpec = `${packageJson.name}@${packageJson.version}`

let message
let source

try {
  message = formatKilobytes(await getBundlephobiaGzipSizeWithRetry(packageSpec))
  source = "bundlephobia"
} catch (error) {
  if (isCi) {
    throw error
  }

  message = (await readPreviousMessage()) ?? FALLBACK_MESSAGE
  source = `fallback: ${error.message}`
}

const badge = {
  schemaVersion: 1,
  label: "gzip",
  message,
  color: "A855F7"
}

await mkdir("website/badges", { recursive: true })
await writeFile(OUTPUT_FILE, `${JSON.stringify(badge, null, 2)}\n`)

console.log(`[badge] ${badge.label}: ${badge.message} (${source})`)
