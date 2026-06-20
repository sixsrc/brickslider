import { watch } from "node:fs"
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const websiteRoot = path.resolve(__dirname, "..")
const contentRoot = path.join(websiteRoot, "content")
const docsContentRoot = path.join(contentRoot, "docs")
const frameworksContentRoot = path.join(contentRoot, "frameworks")
const examplesContentRoot = path.join(contentRoot, "examples")
const examplesRoot = path.join(websiteRoot, "examples")
const outputRoot = path.join(websiteRoot, "docs")
const downloadsRoot = path.join(websiteRoot, "downloads", "examples")

const navSections = [
  {
    title: "Get Started",
    items: [
      { slug: "installation", title: "Installation", file: ["docs", "installation.md"], description: "Install packages and choose the runtime format." },
      { slug: "quick-start", title: "Quick Start", file: ["docs", "quick-start.md"], description: "Mount your first BrickSlider in a few lines." },
      { slug: "basic-markup", title: "Basic Markup", file: ["docs", "basic-markup.md"], description: "Understand the required HTML structure." },
    ],
  },
  {
    title: "Examples",
    items: [
      { slug: "examples-basic-slider", title: "Basic Slider", file: ["examples", "basic-slider.md"], description: "The simplest starting point with arrows, track, and slides." },
      { slug: "examples-per-page", title: "PerPage", file: ["examples", "per-page.md"], description: "Advance slides in fixed groups with paginated navigation." },
      { slug: "examples-slide-sizes", title: "SlideSizes", file: ["examples", "slide-sizes.md"], description: "Mix custom width percentages for selected slide positions." },
      { slug: "examples-responsive", title: "Responsive", file: ["examples", "responsive.md"], description: "Change visible slides and page size across breakpoints." },
      { slug: "examples-responsive-slide-sizes", title: "Responsive + SlideSizes", file: ["examples", "responsive-slide-sizes.md"], description: "Combine breakpoints with slide size overrides." },
      { slug: "examples-drag-free", title: "Drag Free", file: ["examples", "drag-free.md"], description: "Let the track move freely without page snapping." },
      { slug: "examples-progress", title: "Progress", file: ["examples", "progress.md"], description: "Add a visual progress rail to the slider flow." },
      { slug: "examples-auto-height", title: "Auto Height", file: ["examples", "auto-height.md"], description: "Adapt wrapper height to the visible content." },
      { slug: "examples-stories", title: "Stories", file: ["examples", "stories.md"], description: "Story-style flow powered by the separate Stories plugin." },
    ],
  },
  {
    title: "Guides",
    items: [
      { slug: "auto-height", title: "Auto Height", file: ["docs", "auto-height.md"], description: "Let the wrapper follow the visible slide height." },
    ],
  },
  {
    title: "API",
    items: [
      { slug: "options", title: "Options", file: ["docs", "options.md"], description: "See available configuration keys and breakpoints." },
      { slug: "methods", title: "Methods", file: ["docs", "methods.md"], description: "Lifecycle, navigation, and integration helpers." },
      { slug: "events", title: "Events", file: ["docs", "events.md"], description: "Mounted, slide change, destroyed, and stories events." },
    ],
  },
  {
    title: "Plugins",
    items: [
      { slug: "accessibility-plugin", title: "Accessibility", file: ["docs", "accessibility-plugin.md"], description: "Labels, focus helpers, and announcements." },
      { slug: "stories-plugin", title: "Stories", file: ["docs", "stories-plugin.md"], description: "Story-style modal flows with timed progress." },
      { slug: "tailwind-package", title: "Tailwind", file: ["docs", "tailwind-package.md"], description: "Preset CSS and structural utility classes." },
    ],
  },
  {
    title: "Frameworks",
    items: [
      { slug: "react", title: "React", file: ["frameworks", "react.md"], description: "Minimal integration without wrapper packages." },
    ],
  },
]

const allItems = navSections.flatMap(section => section.items)

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[`'"’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function renderInline(text) {
  let html = escapeHtml(text)

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>")

  return html
}

function isTableSeparator(line) {
  return /^\|?(?:\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(line.trim())
}

function renderTable(lines) {
  const rows = lines.map(line =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map(cell => renderInline(cell.trim()))
  )

  const [head, , ...body] = rows
  const thead = `<thead><tr>${head.map(cell => `<th>${cell}</th>`).join("")}</tr></thead>`
  const tbody = `<tbody>${body
    .map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`)
    .join("")}</tbody>`

  return `<div class="table-wrap"><table>${thead}${tbody}</table></div>`
}

function preserveTokens(input, patterns) {
  const tokens = []
  let output = input

  for (const pattern of patterns) {
    output = output.replace(pattern, match => {
      const token = `___TOKEN_${tokens.length}___`
      tokens.push(match)
      return token
    })
  }

  return {
    output,
    restore(value) {
      return value.replace(/___TOKEN_(\d+)___/g, (_match, index) => tokens[Number(index)] ?? "")
    },
  }
}

function renderCodeBlock(source, language) {
  const normalizedLanguage = language.toLowerCase()
  const escaped = escapeHtml(source)

  if (!normalizedLanguage) return escaped

  if (["ts", "tsx", "js", "jsx", "json"].includes(normalizedLanguage)) {
    const preserved = preserveTokens(escaped, [
      /&quot;[\s\S]*?&quot;/g,
      /&#39;[\s\S]*?&#39;/g,
      /`[\s\S]*?`/g,
      /\/\/[^\n]*/g,
    ])

    let html = preserved.output
    html = html.replace(/\b(import|from|const|let|var|new|return|if|else|true|false|null|undefined|type|interface|export|default|async|await)\b/g, '<span class="token keyword">$1</span>')
    html = html.replace(/\b(\d+)\b/g, '<span class="token number">$1</span>')
    html = html.replace(/\b(slider|BrickSlider|AccessibilityPlugin|StoriesPlugin)\b/g, '<span class="token symbol">$1</span>')
    html = preserved.restore(html)
    html = html.replace(/(&quot;[\s\S]*?&quot;|&#39;[\s\S]*?&#39;|`[\s\S]*?`)/g, '<span class="token string">$1</span>')
    html = html.replace(/(\/\/[^\n]*)/g, '<span class="token comment">$1</span>')
    return html
  }

  if (normalizedLanguage === "html") {
    let html = escaped
    html = html.replace(/(&lt;\/?)([a-zA-Z0-9-]+)/g, '$1<span class="token keyword">$2</span>')
    html = html.replace(/\s([a-zA-Z-:]+)=(&quot;.*?&quot;)/g, ' <span class="token property">$1</span>=<span class="token string">$2</span>')
    return html
  }

  if (normalizedLanguage === "css") {
    let html = escaped
    html = html.replace(/([.#]?[a-zA-Z0-9_-]+)(\s*\{)/g, '<span class="token symbol">$1</span>$2')
    html = html.replace(/([a-z-]+)(:\s*)([^;]+)(;?)/g, '<span class="token property">$1</span>$2<span class="token string">$3</span>$4')
    return html
  }

  if (normalizedLanguage === "bash" || normalizedLanguage === "sh") {
    const preserved = preserveTokens(escaped, [/#[^\n]*/g])
    let html = preserved.output
    html = html.replace(/\b(pnpm|npm|npx|node|git)\b/g, '<span class="token keyword">$1</span>')
    html = html.replace(/(@[a-zA-Z0-9/_-]+)/g, '<span class="token symbol">$1</span>')
    html = preserved.restore(html)
    html = html.replace(/(#[^\n]*)/g, '<span class="token comment">$1</span>')
    return html
  }

  return escaped
}

function renderExampleEmbed(src, height = "460", showLink = true) {
  const safeSrc = escapeHtml(src)
  const safeHeight = escapeHtml(height)

  if (src === "/examples/stories/") {
    return `<div class="doc-example doc-example--stories">
    ${renderExampleActions(src)}
    <div class="doc-example-frame doc-example-frame--stories">
      <div data-inline-stories-example></div>
    </div>
    <script type="module" src="/examples/stories/embed.js"><\/script>
  </div>`
  }

  const actions = renderExampleActions(src, showLink)

  return `<div class="doc-example">
    ${actions}
    <div class="doc-example-frame">
      <iframe
        src="${safeSrc}"
        title="BrickSlider live example"
        loading="lazy"
        scrolling="no"
        onload="this.dataset.ready='true'"
        style="height:${safeHeight}px"
      ></iframe>
    </div>
  </div>`
}

function renderExampleActions(src) {
  const slug = src.split("/").filter(Boolean).pop() || "example"
  const safeDownloadHref = escapeHtml(`/downloads/examples/${slug}.source`)
  const safeDownloadName = escapeHtml(`brickslider-${slug}.html`)

  return `<div class="doc-example-actions">
      <a href="${safeDownloadHref}" download="${safeDownloadName}">Download example</a>
    </div>`
}

function renderExampleLink(src) {
  return renderExampleActions(src)
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n")
  const html = []
  const toc = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    if (trimmed.startsWith(":::examplelink")) {
      const [, src = ""] = trimmed.split(/\s+/)
      html.push(renderExampleLink(src))
      index += 1
      continue
    }

    if (trimmed.startsWith(":::example")) {
      const [, src = "", height = "460", linkMode = "link"] = trimmed.split(/\s+/)
      html.push(renderExampleEmbed(src, height, linkMode !== "nolink"))
      index += 1
      continue
    }

    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(trimmed)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2].trim()
      const id = slugify(text)
      if (level >= 2 && level <= 3) toc.push({ level, text, id })
      html.push(`<h${level} id="${id}">${renderInline(text)}</h${level}>`)
      index += 1
      continue
    }

    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim()
      const buffer = []
      index += 1

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        buffer.push(lines[index])
        index += 1
      }

      index += 1
      html.push(
        `<pre><code${language ? ` class="language-${escapeHtml(language)}"` : ""}>${renderCodeBlock(buffer.join("\n"), language)}</code></pre>`
      )
      continue
    }

    if (
      index + 1 < lines.length &&
      trimmed.includes("|") &&
      isTableSeparator(lines[index + 1])
    ) {
      const tableLines = [trimmed, lines[index + 1].trim()]
      index += 2

      while (index < lines.length && lines[index].trim().includes("|")) {
        tableLines.push(lines[index].trim())
        index += 1
      }

      html.push(renderTable(tableLines))
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items = []
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""))
        index += 1
      }

      html.push(`<ul>${items.map(item => `<li>${renderInline(item)}</li>`).join("")}</ul>`)
      continue
    }

    const paragraph = [trimmed]
    index += 1

    while (index < lines.length) {
      const next = lines[index].trim()
      if (
        !next ||
        /^(#{1,6})\s+/.test(next) ||
        next.startsWith("```") ||
        /^[-*]\s+/.test(next) ||
        (next.includes("|") && index + 1 < lines.length && isTableSeparator(lines[index + 1]))
      ) {
        break
      }
      paragraph.push(next)
      index += 1
    }

    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`)
  }

  return {
    html: html.join("\n"),
    toc,
  }
}

function getDescription(markdown) {
  const lines = markdown.split("\n")
  let inCodeBlock = false

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock
      continue
    }

    if (
      inCodeBlock ||
      !line ||
      line.startsWith("#") ||
      /^[-*]\s+/.test(line) ||
      line.startsWith("|") ||
      line.startsWith("**Payload:**")
    ) {
      continue
    }

    return line
  }

  return "Documentation for BrickSlider."
}

function renderSidebar(currentSlug) {
  return navSections
    .map(section => {
      const items = section.items
        .map(item => {
          const active = item.slug === currentSlug
          return `<li>
            <a href="/docs/${item.slug}/" class="nav-link${active ? " active" : ""}">
              ${item.title}
            </a>
          </li>`
        })
        .join("")

      return `<section class="nav-group">
        <h2>${section.title}</h2>
        <ul>${items}</ul>
      </section>`
    })
    .join("")
}

function renderHeader() {
  return `<header class="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex min-h-[92px] max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" class="flex items-center gap-3 py-2">
          <img src="/logo.svg" alt="BrickSlider" width="208" height="62" class="h-14 w-auto" />
        </a>
        <div class="hidden items-center gap-5 text-sm font-medium md:flex">
          <a
            href="https://www.npmjs.com/package/@sixsrc/brick-slider"
            class="docs-version-badge rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold text-primary"
            target="_blank"
            rel="noreferrer"
            data-brickslider-version
            hidden
          ></a>
          <a href="/docs/" class="topbar-link flex items-center gap-2">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>Docs</span>
          </a>
          <a href="https://www.npmjs.com/package/@sixsrc/brick-slider" class="topbar-link flex items-center gap-2" target="_blank" rel="noreferrer">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 7.5v9h10v-6h5v6h5v-9H2z" />
            </svg>
            <span>npm</span>
          </a>
          <a href="https://github.com/sixsrc/brickslider" class="topbar-link flex items-center gap-2" target="_blank" rel="noreferrer">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.54-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .11-.79.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.8c1.02 0 2.05.14 3 .41 2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.62-2.8 5.65-5.48 5.95.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.82.58A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
          <a href="https://github.com/sponsors/malopestorres" class="topbar-link flex items-center gap-2" target="_blank" rel="noreferrer">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" style="color:#bf3989">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>Sponsor</span>
          </a>
        </div>
        <button
          class="docs-top-menu-toggle inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-sm md:hidden"
          type="button"
          aria-label="Open menu"
          aria-expanded="false"
          data-docs-top-open
          data-open="false"
        >
          <svg class="docs-menu-open-icon h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <path d="M5 7h14M5 12h14M5 17h14" />
          </svg>
          <svg class="docs-menu-close-icon hidden h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </header>`
}

function renderMobileTopMenu() {
  return `<div class="docs-top-menu" data-docs-top-menu hidden>
      <nav class="grid gap-3 px-6 py-8 text-lg font-semibold">
        <a
          href="https://www.npmjs.com/package/@sixsrc/brick-slider"
          class="docs-version-badge w-fit rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-bold text-primary"
          target="_blank"
          rel="noreferrer"
          data-brickslider-version
          hidden
        ></a>
        <a href="/docs/" class="topbar-link flex items-center gap-3 rounded-2xl px-4 py-3">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span>Docs</span>
        </a>
        <a href="https://www.npmjs.com/package/@sixsrc/brick-slider" class="topbar-link flex items-center gap-3 rounded-2xl px-4 py-3" target="_blank" rel="noreferrer">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 7.5v9h10v-6h5v6h5v-9H2z" />
          </svg>
          <span>npm</span>
        </a>
        <a href="https://github.com/sixsrc/brickslider" class="topbar-link flex items-center gap-3 rounded-2xl px-4 py-3" target="_blank" rel="noreferrer">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.54-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .11-.79.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.8c1.02 0 2.05.14 3 .41 2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.62-2.8 5.65-5.48 5.95.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.82.58A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </a>
        <a href="https://github.com/sponsors/malopestorres" class="topbar-link flex items-center gap-3 rounded-2xl px-4 py-3 text-[#bf3989]" target="_blank" rel="noreferrer">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span>Sponsor</span>
        </a>
      </nav>
    </div>`
}

function renderMobileDocsNav(currentSlug) {
  return `<button
      class="docs-mobile-nav-trigger"
      type="button"
      aria-label="Open documentation menu"
      aria-expanded="false"
      data-docs-nav-open
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    </button>
    <div class="docs-mobile-nav" data-docs-nav hidden>
      <div class="flex min-h-[92px] items-center justify-between border-b border-gray-200 px-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-primary">Documentation</p>
          <p class="mt-1 text-lg font-extrabold text-gray-950">BrickSlider Docs</p>
        </div>
        <button
          class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-sm"
          type="button"
          aria-label="Close documentation menu"
          data-docs-nav-close
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <nav class="h-[calc(100vh-92px)] overflow-y-auto px-5 py-6">
        ${renderSidebar(currentSlug)}
      </nav>
    </div>`
}

function renderGeneratedNotice() {
  return "<!-- Generated file: do not edit this HTML directly. Edit website/content/**/*.md or website/scripts/build-docs.mjs and regenerate with pnpm docs:build. -->"
}

function renderToc(toc) {
  if (!toc.length) {
    return `<div class="toc-empty">This page has no sub-sections yet.</div>`
  }

  return `<ul class="toc-list">
    ${toc
      .map(
        item => `<li class="level-${item.level}">
          <a href="#${item.id}">${item.text}</a>
        </li>`
      )
      .join("")}
  </ul>`
}

function renderDocsUiScript() {
  return `<script>
    ;(() => {
      const syncPackageVersion = async () => {
        const versionNodes = document.querySelectorAll("[data-brickslider-version]")
        if (!versionNodes.length) return

        try {
          const response = await fetch("https://cdn.jsdelivr.net/npm/@sixsrc/brick-slider/package.json", {
            cache: "no-store"
          })

          if (!response.ok) return

          const packageInfo = await response.json()

          if (!packageInfo.version) return

          versionNodes.forEach(node => {
            node.textContent = "v" + packageInfo.version
            node.setAttribute("aria-label", "BrickSlider version " + packageInfo.version)
            node.hidden = false
          })
        } catch (_error) {
        }
      }

      const bindLayer = ({ open, close, layer }) => {
        const openButton = document.querySelector(open)
        const closeButton = close ? document.querySelector(close) : null
        const layerElement = document.querySelector(layer)

        if (!openButton || !layerElement) return

        const syncBodyLock = () => {
          const hasOpenLayer = document.querySelector("[data-docs-top-menu]:not([hidden]), [data-docs-nav]:not([hidden])")
          document.body.classList.toggle("docs-layer-open", Boolean(hasOpenLayer))
        }

        const setOpen = value => {
          layerElement.hidden = !value
          openButton.setAttribute("aria-expanded", String(value))
          openButton.dataset.open = String(value)
          openButton.querySelector(".docs-menu-open-icon")?.classList.toggle("hidden", value)
          openButton.querySelector(".docs-menu-close-icon")?.classList.toggle("hidden", !value)
          syncBodyLock()

          if (!value) {
            document.body.style.cursor = "default"
            window.setTimeout(() => {
              document.body.style.cursor = ""
            }, 80)
          }
        }

        openButton.addEventListener("click", () => setOpen(layerElement.hidden))
        closeButton?.addEventListener("click", () => setOpen(false))

        layerElement.querySelectorAll("a").forEach(link => {
          link.addEventListener("click", () => setOpen(false))
        })

        document.addEventListener("keydown", event => {
          if (event.key === "Escape") setOpen(false)
        })
      }

      bindLayer({
        open: "[data-docs-top-open]",
        layer: "[data-docs-top-menu]"
      })

      bindLayer({
        open: "[data-docs-nav-open]",
        close: "[data-docs-nav-close]",
        layer: "[data-docs-nav]"
      })

      syncPackageVersion()
    })()
  <\/script>`
}

function renderLayout({ title, description, content, toc, currentSlug }) {
  const pageTitle = `${title} · BrickSlider Docs`
  const canonicalPath = currentSlug ? `/docs/${currentSlug}/` : "/docs/"
  const legacyRedirect = !currentSlug
    ? `
    <script>
      const params = new URLSearchParams(window.location.search)
      const page = params.get("p")
      if (page) {
        window.location.replace("/docs/" + page + "/")
      }
    <\/script>`
    : ""
  const devReloadScript = `
    <script>
      if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        let currentDocsVersion = null

        const checkDocsVersion = async () => {
          try {
            const response = await fetch("/docs/__docs_version__.json?ts=" + Date.now(), {
              cache: "no-store"
            })

            if (!response.ok) return

            const data = await response.json()

            if (currentDocsVersion === null) {
              currentDocsVersion = data.version
              return
            }

            if (currentDocsVersion !== data.version) {
              location.reload()
            }
          } catch (_error) {
          }
        }

        setInterval(checkDocsVersion, 700)
        checkDocsVersion()
      }
    <\/script>`

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="icon" href="/favicon.png" type="image/png" />
    <link rel="canonical" href="https://sixsrc.github.io/brickslider${canonicalPath}" />
${legacyRedirect}
${devReloadScript}
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: "#6D28D9",
              "primary-dark": "#5B21B6",
            },
          },
        },
      }
    </script>
    <style>
      html { scroll-behavior: smooth; }
      body { font-family: Inter, system-ui, sans-serif; }
      .docs-shell { display: grid; grid-template-columns: 280px minmax(0, 1fr) 180px; gap: 0; }
      .sidebar { position: fixed; top: 92px; bottom: 0; width: 240px; overflow-y: auto; transform: translateZ(0); }
      .toc { position: sticky; top: 6rem; max-height: calc(100vh - 7rem); overflow-y: auto; }
      .nav-group + .nav-group { margin-top: 1.5rem; }
      .nav-group h2 { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #6B7280; margin-bottom: 0.75rem; }
      .nav-group ul { display: grid; gap: 0.25rem; }
      .nav-link { display: block; padding: 0.55rem 0.8rem; border-radius: 0.85rem; color: #4B5563; transition: all 0.18s ease; }
      .nav-link:hover { color: #6D28D9; background: #F5F3FF; }
      .nav-link.active { color: #6D28D9; background: #F5F3FF; font-weight: 600; }
      .doc-article { max-width: 980px; }
      .doc-article h1 { font-size: clamp(2.25rem, 4vw, 3.5rem); line-height: 1.05; font-weight: 800; letter-spacing: -0.04em; color: #6D28D9; margin: 0 0 1.5rem; }
      .docs-home-title { white-space: nowrap; }
      .doc-article h2 { font-size: 1.75rem; line-height: 1.15; font-weight: 800; color: #111827; margin: 3rem 0 1rem; scroll-margin-top: 6rem; }
      .doc-article h3 { font-size: 1.25rem; line-height: 1.25; font-weight: 700; color: #4C1D95; margin: 2rem 0 0.75rem; scroll-margin-top: 6rem; }
      .doc-article p, .doc-article td, .doc-article th { font-size: 1.05rem; line-height: 1.8; color: #374151; }
      .doc-article :where(ul:not(.bs-stories-progress), ol) > li { font-size: 1.05rem; line-height: 1.8; color: #374151; }
      .doc-article p + p { margin-top: 1rem; }
      .doc-article :where(ul:not(.bs-stories-progress), ol) { margin: 1rem 0; padding-left: 1.3rem; }
      .doc-article :where(ul:not(.bs-stories-progress), ol) > li + li { margin-top: 0.35rem; }
      .doc-article a { color: #6D28D9; text-decoration: none; }
      .doc-article a:hover { text-decoration: underline; }
      .doc-article code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.9em; background: #F3F4F6; color: #4C1D95; padding: 0.15rem 0.4rem; border-radius: 0.35rem; border: 1px solid #E5E7EB; }
      .doc-article pre { margin: 1.25rem 0; background: #FFFFFF; color: #374151; border-radius: 1rem; padding: 1.1rem 1.25rem; overflow-x: auto; border: 1px solid #E5E7EB; box-shadow: 0 10px 30px rgba(17,24,39,0.04); }
      .doc-article pre code { background: transparent; padding: 0; color: inherit; border: 0; border-radius: 0; box-shadow: none; }
      .doc-example { margin: 1.5rem 0 2rem; }
      .doc-example-frame { border: 0; border-radius: 0; overflow: hidden; background: transparent; box-shadow: none; }
      .doc-example--stories { margin-top: 1.25rem; }
      .doc-example-frame--stories { display: flex; justify-content: flex-start; }
      .doc-example-frame iframe { display: block; width: 100%; border: 0; background: transparent; border-radius: 0; overflow: hidden; opacity: 0; visibility: hidden; transition: opacity 0.12s ease; }
      .doc-example-frame iframe[data-ready="true"] { opacity: 1; visibility: visible; }
      .doc-example-actions { margin-bottom: 0.75rem; display: flex; justify-content: flex-end; gap: 1rem; flex-wrap: wrap; }
      .doc-example-actions a { font-size: 0.95rem; font-weight: 600; }
      .doc-article .token.keyword { color: #6D28D9; font-weight: 600; }
      .doc-article .token.string { color: #0F766E; }
      .doc-article .token.number { color: #C2410C; }
      .doc-article .token.comment { color: #9CA3AF; font-style: italic; }
      .doc-article .token.property { color: #1D4ED8; }
      .doc-article .token.symbol { color: #BE185D; }
      .table-wrap { overflow-x: auto; margin: 1.25rem 0; }
      .doc-article table { width: 100%; border-collapse: collapse; min-width: 560px; }
      .doc-article th { background: #F9FAFB; font-weight: 700; color: #111827; }
      .doc-article th, .doc-article td { border: 1px solid #E5E7EB; padding: 0.85rem 1rem; vertical-align: top; }
      .doc-lead { font-size: 1.15rem; line-height: 1.8; color: #4B5563; margin-bottom: 1.75rem; }
      .toc-title { font-size: 0.9rem; font-weight: 700; color: #111827; margin-bottom: 1rem; }
      .toc-list { display: grid; gap: 0.5rem; }
      .toc-list a { color: #6B7280; line-height: 1.4; transition: color 0.18s ease; }
      .toc-list a:hover { color: #6D28D9; }
      .toc-list .level-3 { padding-left: 0.85rem; }
      .toc-empty { color: #6B7280; font-size: 0.95rem; line-height: 1.6; }
      .docs-home-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 2rem; }
      .docs-home-card { border: 1px solid #E5E7EB; border-radius: 1.25rem; padding: 1.25rem; background: linear-gradient(180deg, #fff, #fafafa); transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease; }
      .docs-home-card:hover { transform: translateY(-2px); border-color: #DDD6FE; box-shadow: 0 18px 40px rgba(17,24,39,0.08); }
      .docs-home-card h3 { margin: 0 0 0.5rem; }
      .docs-home-card p { margin: 0; font-size: 1rem; line-height: 1.7; }
      .topbar-link { color: #374151; transition: color 0.18s ease; }
      .topbar-link:hover { color: #6D28D9; }
      .docs-top-menu { position: fixed; left: 0; right: 0; top: 92px; bottom: 0; width: 100vw; height: calc(100dvh - 92px); z-index: 66; overflow-y: auto; background: #fff; cursor: default; border-top: 1px solid #E5E7EB; box-shadow: 0 18px 40px rgba(17,24,39,0.08); }
      .docs-top-menu[hidden] { display: none !important; }
      .docs-mobile-nav-trigger { display: none; position: fixed; left: 1rem; top: 7rem; z-index: 65; height: 3rem; width: 3rem; align-items: center; justify-content: center; border: 1px solid #E5E7EB; border-radius: 9999px; background: #fff; color: #374151; box-shadow: 0 18px 35px rgba(17,24,39,0.14); }
      .docs-mobile-nav { position: fixed; inset: 0; width: 100vw; height: 100dvh; z-index: 70; overflow-y: auto; background: #fff; cursor: default; }
      .docs-mobile-nav[hidden] { display: none !important; }
      .docs-top-menu a,
      .docs-mobile-nav a { cursor: pointer; }
      .docs-top-menu button,
      .docs-mobile-nav button,
      .docs-mobile-nav-trigger,
      .docs-top-menu-toggle { cursor: default; }
      body.docs-layer-open { overflow: hidden; }
      @media (max-width: 1180px) {
        .docs-shell { grid-template-columns: 260px minmax(0, 1fr); }
        .toc-column { display: none; }
        .sidebar { width: 220px; }
      }
      @media (max-width: 960px) {
        .docs-shell { grid-template-columns: 1fr; }
        .sidebar-column { display: none; }
        .sidebar { position: static; width: auto; height: auto; }
        .doc-article { max-width: 100%; }
        .doc-article h1 { margin-top: 3.5rem; }
        .docs-mobile-nav-trigger { display: flex; }
      }
      @media (min-width: 961px) {
        .docs-top-menu { display: none !important; }
        .docs-mobile-nav,
        .docs-mobile-nav-trigger { display: none !important; }
      }
      @media (max-width: 640px) {
        .docs-home-grid { grid-template-columns: 1fr; }
        .doc-article h1 { font-size: 2rem; }
      }
    </style>
  </head>
  <body class="bg-white text-gray-900">
    ${renderGeneratedNotice()}
    ${renderHeader()}
    ${renderMobileTopMenu()}
    ${renderMobileDocsNav(currentSlug)}

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="docs-shell">
        <aside class="sidebar-column pr-6">
          <div class="sidebar border-r border-gray-200 pt-10 pb-12 pr-6">
            ${renderSidebar(currentSlug)}
          </div>
        </aside>

        <main class="min-w-0 px-0 py-10 md:px-8 lg:px-12">
          <article class="doc-article">
            ${content}
          </article>
        </main>

        ${toc.length ? `<aside class="toc-column pl-6">
          <div class="toc pt-12">
            <h2 class="toc-title">On this page</h2>
            ${renderToc(toc)}
          </div>
        </aside>` : `<div class="toc-column"></div>`}
      </div>
    </div>
    ${renderDocsUiScript()}
  </body>
</html>`
}

function renderDocsHome() {
  const intro = `
    <h1 class="docs-home-title">BrickSlider Docs</h1>
    <p class="doc-lead">
      Start with the core setup, then move into plugins, framework guides, and
      practical API references. Everything here is generated from the project
      markdown sources, so the docs stay aligned with the current library.
    </p>
    <div class="docs-home-grid">
      ${[
        { slug: "installation", title: "Installation", description: "Install packages and choose the runtime format." },
        { slug: "quick-start", title: "Quick Start", description: "Mount your first BrickSlider in a few lines." },
        { slug: "basic-markup", title: "Basic Markup", description: "Understand the required HTML structure." },
        { slug: "examples-basic-slider", title: "Examples", description: "Browse practical slider configurations before diving deeper." },
        { slug: "stories-plugin", title: "Stories", description: "Story-style modal flows with timed progress." },
        { slug: "accessibility-plugin", title: "Accessibility", description: "Labels, focus helpers, and announcements." },
      ]
        .map(
          item => `<a href="/docs/${item.slug}/" class="docs-home-card">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </a>`
        )
        .join("")}
    </div>
  `

  return renderLayout({
    title: "Documentation",
    description: "Start here for installation, markup, API, plugins, and framework guides for BrickSlider.",
    content: intro,
    toc: [],
    currentSlug: "",
  })
}

async function buildPage(item) {
  const sourcePath =
    item.file[0] === "docs"
      ? path.join(docsContentRoot, item.file[1])
      : item.file[0] === "frameworks"
        ? path.join(frameworksContentRoot, item.file[1])
        : path.join(examplesContentRoot, item.file[1])
  const markdown = await readFile(sourcePath, "utf8")
  const { html, toc } = renderMarkdown(markdown)
  const titleMatch = /^#\s+(.+)$/m.exec(markdown)
  const title = titleMatch ? titleMatch[1].trim() : item.title
  const description = getDescription(markdown)
  const outputDir = path.join(outputRoot, item.slug)

  await mkdir(outputDir, { recursive: true })
  await writeFile(
    path.join(outputDir, "index.html"),
    renderLayout({
      title,
      description,
      content: html,
      toc,
      currentSlug: item.slug,
    }),
    "utf8"
  )
}

async function cleanOutput() {
  const entries = await readdir(outputRoot, { withFileTypes: true })
  await Promise.all(
    entries
      .filter(entry => entry.isDirectory())
      .map(entry => rm(path.join(outputRoot, entry.name), { recursive: true, force: true }))
  )
}

async function buildExampleDownloads() {
  await rm(downloadsRoot, { recursive: true, force: true })
  await mkdir(downloadsRoot, { recursive: true })

  const entries = await readdir(examplesRoot, { withFileTypes: true })
  const examples = entries.filter(entry => entry.isDirectory())

  await Promise.all(
    examples.map(async example => {
      const sourcePath = path.join(examplesRoot, example.name, "index.html")
      const outputPath = path.join(downloadsRoot, `${example.name}.source`)

      try {
        const source = await readFile(sourcePath, "utf8")
        const standalone =
          example.name === "stories"
            ? source
            : makeStandaloneExampleDownload(source)

        await writeFile(outputPath, standalone, "utf8")
      } catch {
        // Some example folders can hold shared assets only.
      }
    })
  )
}

function makeStandaloneExampleDownload(source) {
  return materializeExampleSlides(source)
    .replace(
      /\s*<link\s+rel="stylesheet"\s+href="\.\.\/shared\.css"\s*\/?>/g,
      '\n    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>'
    )
    .replace("<body>", '<body class="bg-white p-6 font-sans text-gray-950">')
    .replace(
      /import\s+\{[\s\S]*?\}\s+from\s+["']\.\.\/shared\.js["'];?\n*/g,
      `${standaloneExampleHelpers()}\n`
    )
    .replace(/^\s*document\.querySelector\("\.bs-prev"\)\.innerHTML = arrowPrevSvg\(\)\s*$/gm, "")
    .replace(/^\s*document\.querySelector\("\.bs-next"\)\.innerHTML = arrowNextSvg\(\)\s*$/gm, "")
    .replace(/^\s*createSlides\(document\.querySelector\("\.bs-container"\),\s*\d+\)\s*$/gm, "")
    .replace(/^\s*createAutoHeightSlides\(document\.querySelector\("\.bs-container"\)\)\s*$/gm, "")
    .replaceAll("example-pages", "absolute bottom-2 right-0 font-bold text-violet-700")
    .replaceAll("example-notice-actions", "hidden")
    .replaceAll("example-notice", "hidden rounded-2xl bg-violet-50 p-4 text-violet-800")
    .replaceAll("example-slider--auto-height", "")
    .replaceAll("example-slider--progress", "")
    .replaceAll("example-slider--wide", "max-w-none")
    .replaceAll("example-slider", "relative w-full")
    .replaceAll("example-prev", "left-0")
    .replaceAll("example-next", "left-14")
    .replaceAll(
      "example-arrow",
      "absolute bottom-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-violet-700 text-violet-700"
    )
    .replaceAll("example-page", "mx-auto w-full max-w-5xl")
    .replaceAll("example-track--peek", "")
    .replaceAll("example-track", "overflow-hidden pb-16")
    .replaceAll("example-container", "")
    .replaceAll("example-dots", "absolute bottom-4 left-1/2 m-0 flex -translate-x-1/2 list-none gap-3 p-0")
    .replaceAll(
      "example-dot",
      "h-3 w-3 rounded-full border-2 border-violet-300 [&.bs-dot--active]:border-violet-700 [&.bs-dot--active]:bg-violet-700"
    )
    .replaceAll("example-slide-card--short", "h-44")
    .replaceAll("example-slide-card--medium", "h-72")
    .replaceAll("example-slide-card--tall", "h-96")
    .replaceAll(
      "example-slide-card",
      "flex h-72 items-center justify-center rounded-3xl border border-violet-700 bg-violet-50 text-violet-700"
    )
    .replaceAll(
      "example-slide-label",
      "text-[clamp(4rem,10vw,7rem)] font-bold opacity-90"
    )
    .replaceAll("example-progress-bar", "block h-full bg-violet-700")
    .replaceAll("example-progress", "absolute bottom-16 left-0 right-0 h-2 overflow-hidden rounded-full bg-violet-100")
}

function materializeExampleSlides(source) {
  const container = '<div class="bs-container example-container"></div>'
  const slides = source.includes("createAutoHeightSlides")
    ? createAutoHeightSlidesMarkup()
    : createSlidesMarkup(getExampleSlideTotal(source))

  return materializeExampleArrows(source).replace(
    container,
    `<div class="bs-container example-container">
${slides}
          </div>`
  )
}

function materializeExampleArrows(source) {
  return source
    .replace(
      /<button([^>]*\bbs-prev\b[^>]*)><\/button>/,
      `<button$1>${arrowPrevSvg()}</button>`
    )
    .replace(
      /<button([^>]*\bbs-next\b[^>]*)><\/button>/,
      `<button$1>${arrowNextSvg()}</button>`
    )
}

function getExampleSlideTotal(source) {
  const match = source.match(/createSlides\(document\.querySelector\("\.bs-container"\),\s*(\d+)\)/)

  return Number(match?.[1] ?? 8)
}

function createSlidesMarkup(total = 8) {
  return Array.from({ length: total }, (_, index) => {
    const label = String(index + 1).padStart(2, "0")

    return `            <div class="bs-slide">
              <span class="example-slide-card">
                <span class="example-slide-label">${label}</span>
              </span>
            </div>`
  }).join("\n")
}

function createAutoHeightSlidesMarkup() {
  return [
    ["01", "short"],
    ["02", "medium"],
    ["03", "tall"]
  ].map(([label, size]) => `            <div class="bs-slide">
              <span class="example-slide-card example-slide-card--${size}">
                <span class="example-slide-label">${label}</span>
              </span>
            </div>`).join("\n")
}

function standaloneExampleHelpers() {
  return `
function mountSlider(selector, options) {
  const slider = new window.BrickSlider(selector, options)

  if (window.AccessibilityPlugin) {
    slider.use(
      new window.AccessibilityPlugin({
        useKeyboardNavigation: true
      })
    )
  }

  slider.init()
  return slider
}`
}

function arrowPrevSvg() {
  return `<svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"></path></svg>`
}

function arrowNextSvg() {
  return `<svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>`
}

async function main() {
  await cleanOutput()
  await buildExampleDownloads()

  for (const item of allItems) {
    await buildPage(item)
  }

  await writeFile(path.join(outputRoot, "index.html"), renderDocsHome(), "utf8")
  await writeFile(
    path.join(outputRoot, "__docs_version__.json"),
    JSON.stringify({ version: Date.now() }),
    "utf8"
  )
}

let buildTimer = null
let isBuilding = false
let queuedBuild = false

async function runBuild() {
  if (isBuilding) {
    queuedBuild = true
    return
  }

  isBuilding = true

  try {
    await main()
    console.log("[docs] generated")
  } catch (error) {
    console.error("[docs] build failed")
    console.error(error)
  } finally {
    isBuilding = false

    if (queuedBuild) {
      queuedBuild = false
      await runBuild()
    }
  }
}

function scheduleBuild() {
  if (buildTimer) clearTimeout(buildTimer)
  buildTimer = setTimeout(() => {
    void runBuild()
  }, 80)
}

function startWatchMode() {
  const watchedDirs = [docsContentRoot, frameworksContentRoot, examplesContentRoot]

  for (const directory of watchedDirs) {
    watch(directory, { persistent: true }, (_eventType, filename) => {
      if (!filename || !filename.endsWith(".md")) return
      console.log(`[docs] change detected: ${filename}`)
      scheduleBuild()
    })
  }

  console.log("[docs] watch mode started")
}

const isWatchMode = process.argv.includes("--watch")

runBuild()
  .then(() => {
    if (isWatchMode) {
      startWatchMode()
    }
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
