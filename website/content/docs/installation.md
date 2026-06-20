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

The Tailwind package gives you the structural classes and preset layer.
Visual states such as `.active > .bs-content`, `.bs-dot--active`, and Stories progress colors should still be themed in your own project CSS.

## CDN

Use the official browser bundles in plain HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/@sixsrc/brick-slider@1.0.14/lib/brick-slider.browser.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@sixsrc/brick-slider-accessibility@1.0.9/lib/brick-slider-accessibility.browser.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@sixsrc/brick-slider-stories@1.0.12/lib/brick-slider-stories.browser.js"></script>
<script>
  const { BrickSlider, AccessibilityPlugin, StoriesPlugin } = window

  const slider = new BrickSlider("#slider", {
    slidesPerView: 1,
    slidesPerPage: 1
  })

  slider.use(new AccessibilityPlugin({ useKeyboardNavigation: true }))
  slider.use(
    new StoriesPlugin({ trigger: "#open-stories", duration: 5000 })
  )
  slider.init()
</script>
```
