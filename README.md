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
- [⭐ Highlights](#highlights)
- [✅ Why BrickSlider?](#why-brickslider)
- [📊 Feature Snapshot](#feature-snapshot)
- [📦 Packages](#packages)
- [📥 Installation](#installation)
- [🌐 CDN](#cdn)
- [🧠 TypeScript](#typescript)
- [🚀 Quick Start](#quick-start)
- [🏗️ Basic Markup](#basic-markup)
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

## Highlights

- ✅ TypeScript-first API
- ✅ No runtime dependencies in the core package
- ✅ Web Animations API driven motion
- ✅ Framework-agnostic architecture
- ✅ Dedicated Stories plugin for story-style experiences
- ✅ Dedicated Accessibility plugin for labels, live regions, and keyboard flow
- ✅ Tailwind-friendly markup and structural utilities
- ✅ Bundle size badge available above for quick package weight checks

## Why BrickSlider?

- ✅ Written in TypeScript
- ✅ No runtime dependencies
- ✅ Native Tailwind integration
- ✅ Lightweight, with room for further compression and optimization
- ✅ No freakish inline CSS layout hacks
- ✅ Smooth, modern motion powered by the Web Animations API
- ✅ Supports variable slide sizes and custom breakpoints
- ✅ Includes a story-style carousel inspired by Instagram Stories
- ✅ Accessibility-friendly foundation with a dedicated accessibility plugin

## Feature Snapshot

| Area | BrickSlider |
| --- | --- |
| Core architecture | TypeScript-first, framework-agnostic |
| Motion model | Web Animations API |
| Dependencies | No runtime dependencies in core |
| Stories experience | Dedicated plugin |
| Accessibility | Dedicated plugin |
| Styling approach | Tailwind-friendly markup with user-controlled classes |
| Extensibility | `slider.use(plugin)` |

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
pnpm add @sixsrc/brick-slider
```

```bash
npm install @sixsrc/brick-slider
```

### Accessibility Plugin

```bash
pnpm add @sixsrc/brick-slider @sixsrc/brick-slider-accessibility
```

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-accessibility
```

### Stories Plugin

```bash
pnpm add @sixsrc/brick-slider @sixsrc/brick-slider-stories
```

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-stories
```

### Tailwind Package

```bash
pnpm add @sixsrc/brick-slider-tailwind
```

```bash
npm install @sixsrc/brick-slider-tailwind
```

## CDN

If you prefer a script-tag setup, BrickSlider and the official plugins also ship UMD bundles for CDN usage.

Load the core first, then the plugins you want to use:

```html
<script src="https://unpkg.com/@sixsrc/brick-slider/lib/brick-slider.umd.cjs"></script>
<script src="https://unpkg.com/@sixsrc/brick-slider/lib/plugin-api.umd.cjs"></script>
<script src="https://unpkg.com/@sixsrc/brick-slider-accessibility/lib/brick-slider-accessibility.umd.cjs"></script>
<script src="https://unpkg.com/@sixsrc/brick-slider-stories/lib/brick-slider-stories.umd.cjs"></script>
```

Then create the slider and attach plugins from the exposed globals:

```html
<script>
  const slider = new BrickSlider("#slider", {
    slidesPerView: 1,
    slidesPerPage: 1,
  })

  slider.use(
    new BrickSliderAccessibility({
      useKeyboardNavigation: true,
    })
  )

  slider.use(
    new BrickSliderStories({
      trigger: "#open-stories",
      duration: 5000,
    })
  )

  slider.init()
</script>
```

The available globals are:

- `BrickSlider`
- `BrickSliderPluginApi`
- `BrickSliderAccessibility`
- `BrickSliderStories`

## TypeScript

Public types are exported from the package entries, so IntelliSense works out of the box across the core library and plugins.

### Core

```ts
import { BrickSlider } from "@sixsrc/brick-slider"
import type {
  BrickSliderOptions,
  BrickSliderSlideChangePayload,
  ResponsiveBreakpoint,
  ResponsiveInput
} from "@sixsrc/brick-slider"

const options: BrickSliderOptions = {
  slidesPerView: 1,
  slidesPerPage: 1
}

const slider = new BrickSlider("#slider", options)

slider.on("slideChange", (payload: BrickSliderSlideChangePayload) => {
  console.log(payload.slideIndex, payload.activePage)
})
```

### Accessibility plugin

```ts
import AccessibilityPlugin from "@sixsrc/brick-slider-accessibility"
import type { BrickSliderAccessibilityOptions } from "@sixsrc/brick-slider-accessibility"

const accessibilityOptions: BrickSliderAccessibilityOptions = {
  useKeyboardNavigation: true,
  useFocusManagement: true
}

slider.use(new AccessibilityPlugin(accessibilityOptions))
```

### Stories plugin

```ts
import StoriesPlugin from "@sixsrc/brick-slider-stories"
import type { BrickSliderStoriesOptions } from "@sixsrc/brick-slider-stories"

const storiesOptions: BrickSliderStoriesOptions = {
  duration: 5000,
  maxStories: 10,
  closeOnEnd: true
}

slider.use(new StoriesPlugin(storiesOptions))
```

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

This is the minimal core structure BrickSlider expects:

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

For the structural class reference, see [Tailwind Package](#tailwind-package).

## Options

All current core options are shown below.

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
      slideSizes: {
        0: 100,
      },
    },
    md: {
      slidesPerView: 2,
      slidesPerPage: 2,
      slideSizes: {
        0: 60,
        1: 40,
      },
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
slideSizes: {
  0: 65,
  1: 35,
  2: 25,
  3: 75,
}
```

#### `screens`
Breakpoint values used by the responsive config.

Supported breakpoint keys:

- `xs`
- `sm`
- `md`
- `lg`
- `xl`
- `2xl`

#### `responsive`
Responsive overrides per breakpoint.

Available responsive keys:

- `slidesPerView`
- `slidesPerPage`
- `slideSizes`
- `useSlideSizes`

Example:

```ts
responsive: {
  md: {
    slidesPerView: 2,
    slidesPerPage: 2,
    slideSizes: {
      0: 60,
      1: 40,
    },
  },
  lg: {
    slidesPerView: 4,
    slidesPerPage: 4,
    useSlideSizes: false,
  },
}
```

Use `slideSizes` inside a breakpoint when you want widths specific to that screen.

Use `useSlideSizes: false` inside a breakpoint when you want that breakpoint to ignore both local and global `slideSizes`.

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

```ts
slider.init()
```

### `next()`
Moves to the next page or next free-drag direction.

```ts
slider.next()
```

### `prev()`
Moves to the previous page or previous free-drag direction.

```ts
slider.prev()
```

### `goTo(index)`
Moves to a page index in paged mode.

```ts
slider.goTo(2)
```

### `destroy()`
Restores the original markup snapshot.

```ts
slider.destroy()
```

### `use(plugin)`
Attaches a plugin instance to the current slider.

```ts
slider.use(plugin)
```

## Events

### `mounted`
Fired when the slider DOM and layout are ready.

```ts
slider.on("mounted", payload => {
  console.log("mounted", payload)
})
```

Payload:

- `rootSelector`

### `slideChange`
Fired whenever the active page changes.

```ts
slider.on("slideChange", payload => {
  console.log("slideChange", payload)
})
```

Payload:

- `rootSelector`
- `slideIndex`
- `activePage`

### `destroyed`
Fired after the slider is torn down.

```ts
slider.on("destroyed", payload => {
  console.log("destroyed", payload)
})
```

Payload:

- `rootSelector`

## Plugins

Available plugins today:

- ♿ [Accessibility Plugin](#accessibility-plugin)
- 📱 [Stories Plugin](#stories-plugin)
- 🎨 [Tailwind Package](#tailwind-package)

For lightweight package-specific entry points, each plugin package README can stay short and point back to this main document.

## Accessibility Plugin

### Install

```bash
pnpm add @sixsrc/brick-slider @sixsrc/brick-slider-accessibility
```

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-accessibility
```

### How to configure

The accessibility plugin is created separately and then attached to the main slider instance.

1. Create the slider with `new BrickSlider(...)`
2. Create the accessibility plugin with `new AccessibilityPlugin(...)`
3. Attach it with `slider.use(accessibility)`
4. Start everything with `slider.init()`

The plugin reads the root from the slider host when you attach it with `slider.use(...)`.

### Usage

```ts
import { BrickSlider } from "@sixsrc/brick-slider"
import AccessibilityPlugin from "@sixsrc/brick-slider-accessibility"

const slider = new BrickSlider("#slider")
const accessibility = new AccessibilityPlugin({
  useKeyboardNavigation: true,
  useFocusManagement: true,
})

slider.use(accessibility)
slider.init()
```

### What it adds automatically

When enabled, the plugin can:

- add accessible labels to arrows, dots, and slides
- create a live region for screen reader announcements
- enable keyboard navigation on the slider root
- keep pagination focus aligned with the active page when configured

### Options

```ts
new AccessibilityPlugin({
  useKeyboardNavigation: true,
  useFocusManagement: true,
  labels: {
    root: "Product carousel",
    pagination: "Carousel pagination",
    previousSlide: "Go to previous slide",
    nextSlide: "Go to next slide",
    slide: (slideNumber, totalSlides) =>
      `Slide ${slideNumber} of ${totalSlides}`,
    page: pageNumber => `Go to page ${pageNumber}`,
    liveRegionSingle: (slideNumber, totalSlides) =>
      `Showing slide ${slideNumber} of ${totalSlides}`,
    liveRegionRange: (firstSlideNumber, lastSlideNumber, totalSlides) =>
      `Showing slides ${firstSlideNumber} to ${lastSlideNumber} of ${totalSlides}`,
    liveRegionFallback: totalSlides =>
      `Carousel updated. ${totalSlides} slides available.`,
  },
})
```

#### `useKeyboardNavigation`
Enables arrow-key navigation on the slider root.

#### `useFocusManagement`
Moves focus to the active pagination control when appropriate.

#### `labels`
Overrides all accessible strings, including slide labels and live region messages.

### Full configuration example

```ts
import { BrickSlider } from "@sixsrc/brick-slider"
import AccessibilityPlugin from "@sixsrc/brick-slider-accessibility"

const slider = new BrickSlider("#slider", {
  slidesPerView: 1,
  slidesPerPage: 1,
})

const accessibility = new AccessibilityPlugin({
  useKeyboardNavigation: true,
  useFocusManagement: true,
  labels: {
    root: "Featured products carousel",
    pagination: "Featured products pagination",
    previousSlide: "Show previous product",
    nextSlide: "Show next product",
    slide: (slideNumber, totalSlides) =>
      `Product ${slideNumber} of ${totalSlides}`,
    page: pageNumber => `Go to page ${pageNumber}`,
    liveRegionSingle: (slideNumber, totalSlides) =>
      `Showing product ${slideNumber} of ${totalSlides}`,
    liveRegionRange: (firstSlideNumber, lastSlideNumber, totalSlides) =>
      `Showing products ${firstSlideNumber} to ${lastSlideNumber} of ${totalSlides}`,
    liveRegionFallback: totalSlides =>
      `Carousel updated. ${totalSlides} slides available.`,
  },
})

slider.use(accessibility)
slider.init()
```

### Notes

- the plugin root is inherited automatically from the host slider
- install it before calling `slider.init()`
- it works with the regular slider and with stories-enhanced sliders
- if your arrows or dots are missing from the markup, the plugin cannot label them

## Stories Plugin

If you want the most opinionated feature in the ecosystem, this is probably it.

BrickSlider Stories turns a regular slider into a story-style modal flow with timed progress, video awareness, pause/resume interactions, and a clean plugin attachment model.

### Install

```bash
pnpm add @sixsrc/brick-slider @sixsrc/brick-slider-stories
```

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-stories
```

### Basic Stories Markup

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

const stories = new StoriesPlugin({
  trigger: "#open-stories",
  duration: 5000,
  maxVideoDuration: 60000,
  maxStories: 10,
  closeOnEnd: true,
  pauseOnHover: true,
  useMuted: true,
})

slider.use(stories)
slider.init()
```

### How to configure

The stories plugin also attaches to a normal `BrickSlider` instance.

1. Create a regular slider with `useLoop: false`
2. Create the stories plugin with `new StoriesPlugin(...)`
3. Point `trigger` to the element that should open the stories modal
4. Attach the plugin with `slider.use(stories)`
5. Start the slider with `slider.init()`

The stories plugin does not replace the main slider instance. It extends it with modal behavior, timed progress, and story-specific controls.

### Full configuration example

```ts
import { BrickSlider } from "@sixsrc/brick-slider"
import StoriesPlugin from "@sixsrc/brick-slider-stories"

const slider = new BrickSlider("#stories-slider", {
  slidesPerView: 1,
  slidesPerPage: 1,
  useLoop: false,
})

const stories = new StoriesPlugin({
  trigger: "#open-stories",
  duration: 5000,
  maxVideoDuration: 60000,
  maxStories: 10,
  closeOnEnd: true,
  pauseOnHover: true,
  useMuted: true,
})

slider.use(stories)
slider.init()
```

### What each stories option controls

- `trigger`: the button, link, or element that opens the stories layer
- `duration`: how long non-video stories stay active
- `maxVideoDuration`: the maximum time a video story can drive the progress rail
- `maxStories`: how many progress bars the stories UI is expected to represent cleanly
- `closeOnEnd`: whether the modal closes after the last story
- `pauseOnHover`: whether pointer hover temporarily pauses stories on hover-capable devices
- `useMuted`: whether story videos start muted and expose the mute toggle when a video exists

### Interaction Details

- `Space` pauses or resumes the current story when the stories dialog is open.
- `Escape` closes the stories dialog.
- On desktop, when `pauseOnHover` is enabled, moving the pointer over the story pauses the timed flow and moving the pointer away resumes it.
- On touch devices, pressing and holding the story pauses it temporarily; releasing resumes playback.
- The pause/play overlay is intended for pointer-hover environments. On touch devices, the hold gesture is the primary pause interaction.
- Video stories reuse the first video inside the current story as the source of truth for timed progress, mute, and autoplay behavior.

### Options

#### `trigger`
Defines which element or elements open the stories experience.

#### `duration`
Duration in milliseconds for non-video stories.

Use this for text, image, or mixed-content stories that do not depend on a video duration.

#### `maxVideoDuration`
Maximum accepted duration for a story video before the plugin treats it as too long for the timed story flow.

If a video is longer than this value, the plugin clamps the timed story duration to `maxVideoDuration`.

#### `maxStories`
Maximum number of story progress bars the UI should support.

If your markup contains more stories than this limit, the stories UI only exposes progress up to `maxStories`.

#### `pauseOnHover`
Pauses the current story when the pointer stays over the story area.

This is mainly a desktop behavior. Touch devices rely on the press-and-hold gesture instead.

#### `closeOnEnd`
Closes the stories layer after the last story finishes.

Set this to `false` if you want the last story to stay open instead of closing automatically.

#### `useMuted`
Starts video stories muted and enables the mute toggle when applicable.

The mute control affects the story video element, not the browser tab mute state.

### Troubleshooting

#### Stories markup order

Keep the stories markup in this order:

1. optional arrows before `.bs-track`
2. `.bs-track`
3. `.bs-container` as the first child inside `.bs-track`
4. stories-only elements such as `.bs-stories-progress`, `.bs-stories-pause-indicator`, `.bs-stories-close`, and `.bs-stories-mute` after `.bs-container` or inside `.bs-stories-layer` when applicable
5. `.bs-stories-layer` outside the slider root when you want a dedicated overlay layer

If the plugin reports invalid stories markup, check element order before checking logic.

#### More than one video in the same story

BrickSlider Stories supports multiple videos in the same story as a fallback, but only the **first** video controls:

- timed progress
- autoplay state
- mute state
- automatic story advancement

Additional videos can still render and use their own native controls, but they do not drive the story timer.

#### Story limits

- `duration` controls non-video stories
- `maxVideoDuration` caps how long a video story can hold the progress rail
- `maxStories` caps how many stories the progress UI is expected to represent

Use conservative values if you want the story flow to stay predictable across devices.

### Events

Stories also expose their own dialog lifecycle events:

```ts
slider.on("storiesOpened", rootSelector => {
  console.log("storiesOpened", rootSelector)
})

slider.on("storiesMounted", rootSelector => {
  console.log("storiesMounted", rootSelector)
})

slider.on("storiesClosed", rootSelector => {
  console.log("storiesClosed", rootSelector)
})
```

## Tailwind Package

Install the Tailwind structural package when you want utility-friendly base classes.

### Install

```bash
pnpm add @sixsrc/brick-slider @sixsrc/brick-slider-tailwind tailwindcss
```

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-tailwind tailwindcss
```

### Configure your CSS

Add the Tailwind plugin and preset to your main stylesheet, for example `app.css`:

```css
@import "tailwindcss";
@import "@sixsrc/brick-slider-tailwind/preset.css";
@plugin "@sixsrc/brick-slider-tailwind";
```

That is all you need to make the structural BrickSlider classes available in a Tailwind v4 setup.

### Core Class Reference

- `bs-track` — required viewport wrapper
- `bs-container` — required slide row inside `bs-track`
- `bs-slide` — required slide item inside `bs-container`
- `bs-arrow` — base arrow class
- `bs-prev` — previous button variant
- `bs-next` — next button variant
- `bs-pages` — optional current page output such as `2/5`
- `bs-dots` — optional pagination container
- `bs-dot` — optional pagination item template
- `bs-progress` — optional progress rail container
- `bs-progress-bar` — required bar element inside `bs-progress`
- `bs-hidden` — utility class used before mount
- `bs-peek` / `bs-peek-sm` / `bs-peek-lg` — optional peek spacing variants for `bs-track`
- `bs-auto-height-layout` — optional helper class for auto-height layouts

### Stories Class Reference

- `bs-stories-progress` — stories progress rail container
- `bs-stories-progress-item` — stories progress segment
- `bs-stories-progress-bar` — animated bar inside each progress item
- `bs-stories-pause-indicator` — play/pause overlay control
- `bs-stories-pause` — pause icon or label container
- `bs-stories-play` — play icon or label container
- `bs-stories-layer` — optional stories overlay layer
- `bs-stories-backdrop` — optional backdrop inside the stories layer
- `bs-stories-close` — close button
- `bs-stories-mute` — mute button for video stories

### Markup Rules

- `bs-track` is required
- `bs-container` must live inside `bs-track`
- `bs-slide` items must live inside `bs-container`
- `bs-prev` and `bs-next` are optional, but must be `button` elements
- `bs-dots` is optional, but if used, include one `bs-dot` as the template
- `bs-progress` is optional, and `bs-progress-bar` is required inside it

## Framework Guides

BrickSlider is framework-agnostic by design.

Instead of maintaining official wrappers for each UI framework, we keep the core library focused and welcome community-written integration guides that show how to use BrickSlider inside real projects.

### Guide Template

- [Framework Tutorial Template](./website/content/frameworks/TEMPLATE.md)

### Available Guides

- [React Quick Start](./website/content/frameworks/react.md)

## Project Links

- 🐞 Found a bug or want to suggest an improvement? Open an issue in the [GitHub issue tracker](https://github.com/sixsrc/brickslider/issues)
- 🤝 Want to help shape the project? Read [CONTRIBUTING.md](./CONTRIBUTING.md) to join in with code, docs, or ideas

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
