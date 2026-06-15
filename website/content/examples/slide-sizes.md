# SlideSizes

Use `slideSizes` when selected slides need custom percentage widths.

## Live Example

:::example /examples/slide-sizes/ 500

## Usage

```ts
import { BrickSlider } from "@sixsrc/brick-slider"

const slider = new BrickSlider("#slider", {
  slidesPerView: 2,
  slidesPerPage: 2,
  gap: 20,
  slideSizes: {
    0: 65,
    1: 35,
    2: 25,
    3: 75,
    6: 55,
    7: 45
  },
  useLoop: true
})

slider.init()
```

## Notes

- Keys start at `0`
- Values are percentages
- This is useful when you want editorial or asymmetrical layouts
