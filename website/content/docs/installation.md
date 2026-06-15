# Installation

Install only the packages you need. All packages are framework-agnostic.

## Core

```bash
pnpm add @sixsrc/brick-slider
# or
npm install @sixsrc/brick-slider
```

## Accessibility

```bash
pnpm add @sixsrc/brick-slider @sixsrc/brick-slider-accessibility
# or
npm install @sixsrc/brick-slider @sixsrc/brick-slider-accessibility
```

## Stories

```bash
pnpm add @sixsrc/brick-slider @sixsrc/brick-slider-stories
# or
npm install @sixsrc/brick-slider @sixsrc/brick-slider-stories
```

## Tailwind

```bash
pnpm add @sixsrc/brick-slider @sixsrc/brick-slider-tailwind tailwindcss
# or
npm install @sixsrc/brick-slider @sixsrc/brick-slider-tailwind tailwindcss
```

## CDN

Use ESM in the browser and import only the packages you need:

```html
<script type="module">
  import { BrickSlider } from "https://cdn.jsdelivr.net/npm/@sixsrc/brick-slider/+esm"
  import AccessibilityPlugin from "https://cdn.jsdelivr.net/npm/@sixsrc/brick-slider-accessibility/+esm"
  import StoriesPlugin from "https://cdn.jsdelivr.net/npm/@sixsrc/brick-slider-stories/+esm"

  const slider = new BrickSlider("#slider", {
    slidesPerView: 1,
    slidesPerPage: 1
  })

  slider.use(new AccessibilityPlugin({ useKeyboardNavigation: true }))
  slider.use(
    new StoriesPlugin({ trigger: "#open-stories", duration: 5000 })
  )
  slider.init()
<\/script>
```
