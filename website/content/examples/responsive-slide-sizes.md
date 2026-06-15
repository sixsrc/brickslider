# Responsive + SlideSizes

Combine breakpoints with custom slide widths when the layout changes per screen.

Reduce the browser width while watching the live demo. This setup changes both the number of visible slides and the width distribution at each breakpoint, so the effect is much easier to notice.

## Live Example

:::example /examples/responsive-slide-sizes/ 560 nolink

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
      slidesPerPage: 1,
      useSlideSizes: false
    },
    sm: {
      slidesPerView: 2,
      slidesPerPage: 1,
      slideSizes: {
        0: 65,
        1: 35
      }
    },
    md: {
      slidesPerView: 2,
      slidesPerPage: 2,
      slideSizes: {
        0: 30,
        1: 70
      }
    },
    lg: {
      slidesPerView: 3,
      slidesPerPage: 2,
      slideSizes: {
        0: 50,
        1: 30,
        2: 20
      }
    },
    xl: {
      slidesPerView: 4,
      slidesPerPage: 4,
      slideSizes: {
        0: 38,
        1: 22,
        2: 20,
        3: 20
      }
    }
  },
  useLoop: true
})

slider.init()
```

## Notes

- Use `useSlideSizes: false` to disable size overrides on a breakpoint
- Resize the window to compare how each breakpoint redistributes the layout
- This is useful when mobile needs a simpler layout than desktop
