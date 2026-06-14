# Installation

Install only the packages you need. All packages are framework-agnostic.

## Core

```bash
npm install @sixsrc/brick-slider
# or
pnpm add @sixsrc/brick-slider
```

## Accessibility

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-accessibility
```

## Stories

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-stories
```

## Tailwind

```bash
npm install @sixsrc/brick-slider-tailwind tailwindcss
```

## CDN

Load the core first, then any plugins you want:

```html
<script src="https://unpkg.com/@sixsrc/brick-slider/lib/brick-slider.umd.cjs"></script>
<script src="https://unpkg.com/@sixsrc/brick-slider-accessibility/lib/brick-slider-accessibility.umd.cjs"></script>
<script src="https://unpkg.com/@sixsrc/brick-slider-stories/lib/brick-slider-stories.umd.cjs"></script>
```

Available globals: `BrickSlider`, `BrickSliderPluginApi`, `AccessibilityPlugin`, `StoriesPlugin`.