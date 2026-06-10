<p align='center'>
  <img src='./packages/slider/public/logo.svg' height='76'/>
</p>

<h2 align="center">The modular carousel engine for the modern web.</h2>

<p align="center">
  <strong>TypeScript First</strong>
  &nbsp;•&nbsp;
  <strong>Plugin Driven</strong>
  &nbsp;•&nbsp;
  <strong>WAAPI Powered</strong>
  &nbsp;•&nbsp;
  <strong>Framework Agnostic</strong>
</p>

BrickSlider is a TypeScript-first, Tailwind-first carousel engine focused on modern motion, clean markup, and plugin-driven features for production-ready sliders and story-style experiences.

The core stays small and framework-agnostic, while the default authoring experience is built around Tailwind-friendly markup and plugins for accessibility helpers and story-style flows.

<p align="center">
  <a href="https://www.jsdelivr.com/package/npm/@sixsrc/brick-slider">
    <img src="https://data.jsdelivr.com/v1/package/npm/@sixsrc/brick-slider/badge" alt="jsDelivr downloads" />
  </a>
  <a href="https://www.npmjs.com/package/@sixsrc/brick-slider">
    <img src="https://img.shields.io/bundlephobia/minzip/@sixsrc/brick-slider?label=size" alt="Bundle size" />
  </a>
</p>

## Table of Contents

- [💜 Support](#support)
- [✅ Why BrickSlider?](#why-brickslider)
- [📦 Packages](#packages)
- [📥 Installation](#installation)
- [🌐 CDN](#cdn)
- [🚀 Quick Start](#quick-start)
- [🏗️ Basic Markup](#basic-markup)
- [🧠 TypeScript](#typescript)
- [⚙️ Options](#options)
- [🧩 Methods](#methods)
- [📡 Events](#events)
- [🔌 Plugins](#plugins)
  - [♿ Accessibility Plugin](#accessibility-plugin)
  - [📱 Stories Plugin](#stories-plugin)
  - [🎨 Tailwind Package](#tailwind-package)
- [🧱 Framework Guides](#framework-guides)
- [🤝 Project Links](#project-links)

## Support

If this project helps you, please consider supporting its development.

- 💜 [GitHub Sponsors](https://github.com/sponsors/malopestorres)
- ✨ Additional support link coming soon.

## Why BrickSlider?

| Area | BrickSlider |
| --- | --- |
| Core architecture | TypeScript-first, framework-agnostic |
| Motion model | Web Animations API |
| Dependencies | No runtime dependencies in core |
| Stories experience | Dedicated plugin |
| Accessibility | Dedicated plugin |
| Styling approach | Tailwind-friendly markup with user-controlled classes |
| Extensibility | `slider.use(plugin)` |

- ✅ Written in TypeScript with no runtime dependencies
- ✅ Native Tailwind integration, no freakish inline CSS layout hacks
- ✅ Smooth, modern motion powered by the Web Animations API
- ✅ Supports variable slide sizes and custom breakpoints
- ✅ Includes a story-style carousel inspired by Instagram Stories
- ✅ Accessibility-friendly foundation with a dedicated plugin

## Packages

BrickSlider is organized as a small monorepo with focused packages:

- 📦 `@sixsrc/brick-slider` — the core slider library
- ♿ `@sixsrc/brick-slider-accessibility` — accessibility helpers and announcements
- 📱 `@sixsrc/brick-slider-stories` — story-style modal carousel behavior
- 🎨 `@sixsrc/brick-slider-tailwind` — structural Tailwind utilities for BrickSlider markup

## Installation

Install only the packages you need.

### Core

```bash
npm install @sixsrc/brick-slider
# or
pnpm add @sixsrc/brick-slider
```

### Accessibility Plugin

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-accessibility
```

### Stories Plugin

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-stories
```

### Tailwind Package

```bash
npm install @sixsrc/brick-slider-tailwind
```

## CDN

Load the core first, then any plugins you want:

```html
<script src="https://unpkg.com/@sixsrc/brick-slider/lib/brick-slider.umd.cjs"></script>
<script src="https://unpkg.com/@sixsrc/brick-slider/lib/plugin-api.umd.cjs"></script>
<script src="https://unpkg.com/@sixsrc/brick-slider-accessibility/lib/brick-slider-accessibility.umd.cjs"></script>
<script src="https://unpkg.com/@sixsrc/brick-slider-stories/lib/brick-slider-stories.umd.cjs"></script>
```

```html
<script>
  const slider = new BrickSlider("#slider", {
    slidesPerView: 1,
    slidesPerPage: 1,
  })

  slider.use(new BrickSliderAccessibility({ useKeyboardNavigation: true }))
  slider.use(new BrickSliderStories({ trigger: "#open-stories", duration: 5000 }))
  slider.init()
</script>
```

Available globals: `BrickSlider`, `BrickSliderPluginApi`, `BrickSliderAccessibility`, `BrickSliderStories`.

## Quick Start

```ts
import { BrickSlider } from "@sixsrc/brick-slider"

const slider = new BrickSlider("#slider", {
  slidesPerView: 1,
  slidesPerPage: 1,
  gap: 16,
  useLoop: false,
})

slider.init()
```

## Basic Markup

```html
<div id="slider">
  <button class="bs-arrow bs-prev" type="button">Prev</button>
  <button class="bs-arrow bs-next" type="button">Next</button>
  <div class="bs-pages"></div>

  <div class="bs-track">
    <div class="bs-container">
      <div class="bs-slide">Slide 01</div>
      <div class="bs-slide">Slide 02</div>
      <div class="bs-slide">Slide 03</div>
    </div>
  </div>

  <ul class="bs-dots">
    <li class="bs-dot"></li>
  </ul>

  <div class="bs-progress">
    <div class="bs-progress-bar"></div>
  </div>
</div>
```

## TypeScript

Public types are exported from the package entries, so IntelliSense works out of the box.

### Core

```ts
import { BrickSlider } from "@sixsrc/brick-slider"
import type {
  BrickSliderOptions,
  BrickSliderSlideChangePayload,
  ResponsiveBreakpoint,
  ResponsiveInput
} from "@sixsrc/brick-slider"

const slider = new BrickSlider("#slider", { slidesPerView: 1, slidesPerPage: 1 })

slider.on("slideChange", (payload: BrickSliderSlideChangePayload) => {
  console.log(payload.slideIndex, payload.activePage)
})
```

### Accessibility plugin

```ts
import AccessibilityPlugin from "@sixsrc/brick-slider-accessibility"
import type { BrickSliderAccessibilityOptions } from "@sixsrc/brick-slider-accessibility"

slider.use(new AccessibilityPlugin({ useKeyboardNavigation: true, useFocusManagement: true }))
```

### Stories plugin

```ts
import StoriesPlugin from "@sixsrc/brick-slider-stories"
import type { BrickSliderStoriesOptions } from "@sixsrc/brick-slider-stories"

slider.use(new StoriesPlugin({ duration: 5000, maxStories: 10, closeOnEnd: true }))
```

## Options

```ts
const slider = new BrickSlider("#slider", {
  gap: 20,
  slidesPerPage: 1,
  slidesPerView: 1,
  slideSizes: {
    0: 60,
    1: 40,
  },
  screens: {
    xs: 320,
    md: 768,
    lg: 1024,
  },
  responsive: {
    xs: {
      slidesPerView: 1,
      slidesPerPage: 1,
      slideSizes: { 0: 100 },
    },
    md: {
      slidesPerView: 2,
      slidesPerPage: 2,
      slideSizes: { 0: 60, 1: 40 },
    },
    lg: {
      slidesPerView: 3,
      slidesPerPage: 3,
      useSlideSizes: false,
    },
  },
  useTouch: true,
  useLoop: true,
  useDragFree: false,
  useAutoHeight: false,
})
```

### Option Reference

#### `gap`
Spacing between slides in pixels.

#### `slidesPerPage`
How many slides are advanced per paginated navigation step.

#### `slidesPerView`
How many slides are visible at once.

#### `slideSizes`
A map of custom width percentages per slide index.

```ts
slideSizes: { 0: 65, 1: 35, 2: 25, 3: 75 }
```

#### `screens`
Breakpoint values used by the responsive config. Supported keys: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`.

#### `responsive`
Responsive overrides per breakpoint. Available keys: `slidesPerView`, `slidesPerPage`, `slideSizes`, `useSlideSizes`.

Use `useSlideSizes: false` inside a breakpoint to ignore both local and global `slideSizes` at that screen size.

#### `useTouch`
Enables touch and drag interactions.

#### `useLoop`
Creates an infinite carousel by cloning slides.

#### `useDragFree`
Disables paged snapping and allows free dragging.

#### `useAutoHeight`
Adjusts the slider height to the current visible content.

## Methods

### `init()`
Mounts the slider.

### `next()` / `prev()`
Moves to the next or previous page.

### `goTo(index)`
Moves to a specific page index.

### `destroy()`
Restores the original markup snapshot.

### `use(plugin)`
Attaches a plugin instance to the slider.

## Events

### `mounted`
Fired when the slider DOM and layout are ready. Payload: `rootSelector`.

### `slideChange`
Fired whenever the active page changes. Payload: `rootSelector`, `slideIndex`, `activePage`.

### `destroyed`
Fired after the slider is torn down. Payload: `rootSelector`.

```ts
slider.on("slideChange", payload => {
  console.log(payload.slideIndex, payload.activePage)
})
```

## Plugins

- ♿ [Accessibility Plugin](#accessibility-plugin)
- 📱 [Stories Plugin](#stories-plugin)
- 🎨 [Tailwind Package](#tailwind-package)

## Accessibility Plugin

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-accessibility
```

### Usage

```ts
import { BrickSlider } from "@sixsrc/brick-slider"
import AccessibilityPlugin from "@sixsrc/brick-slider-accessibility"

const slider = new BrickSlider("#slider", { slidesPerView: 1, slidesPerPage: 1 })

slider.use(new AccessibilityPlugin({
  useKeyboardNavigation: true,
  useFocusManagement: true,
  labels: {
    root: "Featured products carousel",
    pagination: "Featured products pagination",
    previousSlide: "Show previous product",
    nextSlide: "Show next product",
    slide: (slideNumber, totalSlides) => `Product ${slideNumber} of ${totalSlides}`,
    page: pageNumber => `Go to page ${pageNumber}`,
    liveRegionSingle: (slideNumber, totalSlides) =>
      `Showing product ${slideNumber} of ${totalSlides}`,
    liveRegionRange: (firstSlideNumber, lastSlideNumber, totalSlides) =>
      `Showing products ${firstSlideNumber} to ${lastSlideNumber} of ${totalSlides}`,
    liveRegionFallback: totalSlides =>
      `Carousel updated. ${totalSlides} slides available.`,
  },
}))

slider.init()
```

### What it adds automatically

- Accessible labels for arrows, dots, and slides
- A live region for screen reader announcements
- Keyboard navigation on the slider root
- Focus alignment with the active page when `useFocusManagement` is enabled

### Options

#### `useKeyboardNavigation`
Enables arrow-key navigation on the slider root.

#### `useFocusManagement`
Moves focus to the active pagination control when appropriate.

#### `labels`
Overrides all accessible strings, including slide labels and live region messages.

### Notes

- The plugin root is inherited automatically from the host slider.
- Attach before calling `slider.init()`.
- Works with both regular sliders and stories-enhanced sliders.
- If arrows or dots are missing from the markup, the plugin cannot label them.

## Stories Plugin

BrickSlider Stories turns a regular slider into a story-style modal flow with timed progress, video awareness, and pause/resume interactions.

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-stories
```

### Markup

```html
<button id="open-stories" type="button">Open Stories</button>

<div id="stories-slider">
  <button class="bs-arrow bs-prev" type="button">Prev</button>
  <button class="bs-arrow bs-next" type="button">Next</button>

  <div class="bs-track">
    <div class="bs-container">
      <div class="bs-slide">Story 01</div>
      <div class="bs-slide">Story 02</div>
      <div class="bs-slide">Story 03</div>
    </div>

    <ul class="bs-stories-progress">
      <li class="bs-stories-progress-item">
        <span class="bs-stories-progress-bar"></span>
      </li>
    </ul>

    <button class="bs-stories-pause-indicator" type="button">
      <span class="bs-stories-pause">Pause</span>
      <span class="bs-stories-play hidden">Play</span>
    </button>
  </div>
</div>

<div class="bs-stories-layer hidden">
  <div class="bs-stories-backdrop"></div>
  <button class="bs-stories-close" type="button">Close</button>
  <button class="bs-stories-mute" type="button">Mute</button>
</div>
```

### Usage

```ts
import { BrickSlider } from "@sixsrc/brick-slider"
import StoriesPlugin from "@sixsrc/brick-slider-stories"

const slider = new BrickSlider("#stories-slider", {
  slidesPerView: 1,
  slidesPerPage: 1,
  useLoop: false,
})

slider.use(new StoriesPlugin({
  trigger: "#open-stories",
  duration: 5000,
  maxVideoDuration: 60000,
  maxStories: 10,
  closeOnEnd: true,
  pauseOnHover: true,
  useMuted: true,
}))

slider.init()
```

### Options

| Option | Description |
| --- | --- |
| `trigger` | Element or selector that opens the stories modal |
| `duration` | Duration in ms for non-video stories |
| `maxVideoDuration` | Maximum video duration before clamping to this value |
| `maxStories` | Maximum number of progress bars the UI should represent |
| `pauseOnHover` | Pauses the story on pointer hover (desktop) |
| `closeOnEnd` | Closes the modal after the last story finishes |
| `useMuted` | Starts video stories muted and enables the mute toggle |

### Interactions

- `Space` — pause/resume the current story
- `Escape` — close the stories dialog
- Desktop: pointer hover pauses when `pauseOnHover` is enabled
- Touch: press and hold to pause, release to resume

### Events

```ts
slider.on("storiesOpened", rootSelector => { ... })
slider.on("storiesMounted", rootSelector => { ... })
slider.on("storiesClosed", rootSelector => { ... })
```

### Troubleshooting

**Markup order** — keep this structure: optional arrows → `.bs-track` → `.bs-container` as first child → stories-specific elements after `.bs-container` → `.bs-stories-layer` outside the slider root.

**Multiple videos per story** — only the first video drives timed progress, autoplay, and mute state.

## Tailwind Package

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-tailwind tailwindcss
```

Add the plugin and preset to your main stylesheet:

```css
@import "tailwindcss";
@import "@sixsrc/brick-slider-tailwind/preset.css";
@plugin "@sixsrc/brick-slider-tailwind";
```

### Class Reference

**Core**

| Class | Description |
| --- | --- |
| `bs-track` | Required viewport wrapper |
| `bs-container` | Required slide row inside `bs-track` |
| `bs-slide` | Required slide item inside `bs-container` |
| `bs-arrow` / `bs-prev` / `bs-next` | Arrow navigation buttons |
| `bs-pages` | Optional current page output (e.g. `2/5`) |
| `bs-dots` / `bs-dot` | Optional pagination container and item template |
| `bs-progress` / `bs-progress-bar` | Optional progress rail |
| `bs-hidden` | Utility class used before mount |
| `bs-peek` / `bs-peek-sm` / `bs-peek-lg` | Optional peek spacing variants for `bs-track` |
| `bs-auto-height-layout` | Optional helper for auto-height layouts |

**Stories**

| Class | Description |
| --- | --- |
| `bs-stories-progress` | Stories progress rail container |
| `bs-stories-progress-item` | Stories progress segment |
| `bs-stories-progress-bar` | Animated bar inside each progress item |
| `bs-stories-pause-indicator` | Play/pause overlay control |
| `bs-stories-pause` / `bs-stories-play` | Pause/play icon or label containers |
| `bs-stories-layer` | Optional stories overlay layer |
| `bs-stories-backdrop` | Optional backdrop inside the stories layer |
| `bs-stories-close` | Close button |
| `bs-stories-mute` | Mute button for video stories |

## Framework Guides

BrickSlider is framework-agnostic by design. Instead of maintaining official wrappers, we welcome community-written integration guides.

- [Framework Tutorial Template](./website/content/frameworks/TEMPLATE.md)
- [React Quick Start](./website/content/frameworks/react.md)

## Project Links

- 🐞 Found a bug or want to suggest an improvement? Open an issue in the [GitHub issue tracker](https://github.com/sixsrc/brickslider/issues)
- 🤝 Want to help shape the project? Read [CONTRIBUTING.md](./CONTRIBUTING.md)

## Contributors

<p align="center">
  <a href="https://github.com/malopestorres">
    <img src="https://avatars.githubusercontent.com/u/14898081?v=4&s=100" width="96" alt="@malopestorres" style="border-radius:50%" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/malopestorres"><strong>@malopestorres</strong></a>
</p>

## License

BrickSlider is released under the MIT license. © 2026 [@sixsrc](https://github.com/sixsrc) | [@malopestorres](https://github.com/malopestorres)
