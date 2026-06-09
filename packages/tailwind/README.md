# `@sixsrc/brick-slider-tailwind`

Structural Tailwind package for BrickSlider.

It provides the structural slider classes without forcing a visual theme.
In practice, the package handles the layout layer and leaves the final styling in the user's hands.

## Installation

```bash
pnpm add @sixsrc/brick-slider @sixsrc/brick-slider-tailwind tailwindcss
```

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-tailwind tailwindcss
```

## CSS Setup

Add the plugin and preset to your main stylesheet, for example `app.css`:

```css
@import "tailwindcss";
@import "@sixsrc/brick-slider-tailwind/preset.css";
@plugin "@sixsrc/brick-slider-tailwind";
```

This is the required CSS configuration for a Tailwind v4 project.

## Exported Classes

- `bs-root`
- `bs-track`
- `bs-container`
- `bs-slide`
- `bs-dots`
- `bs-dot`
- `bs-arrow`
- `bs-prev`
- `bs-next`
- `bs-hidden`
- `bs-peek`
- `bs-peek-sm`
- `bs-peek-lg`

The `bs-peek`, `bs-peek-sm`, and `bs-peek-lg` classes are optional and should be applied to the `bs-track` element.

- `bs-peek-sm` = `48px` per side
- `bs-peek` = `80px` per side
- `bs-peek-lg` = `120px` per side

## Active State Example

```css
.active > .bs-content {
  @apply border border-violet-800 rounded-lg;
}

.bs-dot--active {
  @apply bg-violet-800 border border-violet-800;
}
```

## Arrow Navigation

Use `bs-arrow` as the base class and add:

- `bs-prev` for the previous button
- `bs-next` for the next button

## Responsive `slideSizes`

Global `slideSizes` works as a fallback.

Priority:

- `responsive[breakpoint].useSlideSizes === false` → ignores all `slideSizes`
- `responsive[breakpoint].slideSizes` → overrides the global config
- `slideSizes` global → fallback

Exemplo:

```ts
{
  slideSizes: {
    0: 70,
    1: 15,
    2: 15
  },
  responsive: {
    xs: {
      slidesPerView: 1,
      slidesPerPage: 1,
      useSlideSizes: false
    },
    lg: {
      slidesPerView: 4,
      slidesPerPage: 4
    }
  }
}
```

`useSlideSizes: true` is unnecessary because `slideSizes` is already implicitly enabled.

## Without Tailwind

If you do not want Tailwind, keep the same `bs-*` markup classes and generate your own plain CSS output from the Tailwind-based markup when needed.

## Monorepo Development

In the local demo of this repository, the plugin is loaded like this:

```css
@import "../../../tailwind/src/preset.css";
@plugin "../../../tailwind/src/index.ts";
```
