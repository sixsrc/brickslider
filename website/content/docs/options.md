# Options

## Configuration

```ts
const slider = new BrickSlider("#slider", {
  gap: 20,
  slidesPerPage: 1,
  slidesPerView: 1,
  slideSizes: {
    0: 60,
    1: 40
  },
  screens: {
    xs: 320,
    md: 768,
    lg: 1024
  },
  responsive: {
    xs: {
      slidesPerView: 1,
      slidesPerPage: 1,
      slideSizes: { 0: 100 }
    },
    md: {
      slidesPerView: 2,
      slidesPerPage: 2,
      slideSizes: { 0: 60, 1: 40 }
    },
    lg: {
      slidesPerView: 3,
      slidesPerPage: 3,
      useSlideSizes: false
    }
  },
  useTouch: true,
  useLoop: true,
  useDragFree: false,
  useAutoHeight: false
})
```

## Option Reference

### `gap`

Spacing between slides in pixels.

### `slidesPerPage`

How many slides are advanced per paginated navigation step.

### `slidesPerView`

How many slides are visible at once.

### `slideSizes`

A map of custom width percentages per slide index.

```ts
slideSizes: { 0: 65, 1: 35, 2: 25, 3: 75 }
```

### `screens`

Breakpoint values used by the responsive config. Supported keys: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`.

### `responsive`

Responsive overrides per breakpoint. Available keys: `slidesPerView`, `slidesPerPage`, `slideSizes`, `useSlideSizes`.

Use `useSlideSizes: false` inside a breakpoint to ignore both local and global `slideSizes`.

### `useTouch`

Enables touch and drag interactions.

### `useLoop`

Creates an infinite carousel by cloning slides.

### `useDragFree`

Disables paged snapping and allows free dragging.

### `useAutoHeight`

Adjusts the slider height to the current visible content.