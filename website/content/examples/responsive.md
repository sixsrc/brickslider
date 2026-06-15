# Responsive

Use responsive breakpoints to change layout rules across screen sizes.

Reduce the browser width while looking at the live demo below. This example is intentionally set up to look very different across breakpoints so the behavior is obvious at a glance.

## Live Example

:::example /examples/responsive/ 560 nolink

## Usage

```ts
import { BrickSlider } from "@sixsrc/brick-slider"

const slider = new BrickSlider("#slider", {
  slidesPerView: 1,
  slidesPerPage: 1,
  gap: 20,
  screens: {
    xs: 320,
    sm: 540,
    md: 768,
    lg: 1024,
    xl: 1280
  },
  responsive: {
    xs: {
      slidesPerView: 1,
      slidesPerPage: 1
    },
    sm: {
      slidesPerView: 2,
      slidesPerPage: 1
    },
    md: {
      slidesPerView: 2,
      slidesPerPage: 2
    },
    lg: {
      slidesPerView: 3,
      slidesPerPage: 2
    },
    xl: {
      slidesPerView: 4,
      slidesPerPage: 4
    }
  },
  useLoop: true
})

slider.init()
```

## Notes

- `screens` defines the breakpoint values
- `responsive` applies per-breakpoint overrides
- Resize the window to verify each breakpoint visually
- Supported breakpoint keys are `xs`, `sm`, `md`, `lg`, `xl`, `2xl`
