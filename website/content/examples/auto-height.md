# Auto Height

Use auto height when the visible content changes in height from slide to slide.

## Live Example

:::example /examples/auto-height/ 520

## Usage

```ts
import { BrickSlider } from "@sixsrc/brick-slider"

const slider = new BrickSlider("#slider", {
  slidesPerView: 1,
  slidesPerPage: 1,
  gap: 20,
  useAutoHeight: true,
  useLoop: true
})

slider.init()
```

## Notes

- The wrapper adapts to the currently visible content
- This is useful for mixed text blocks, cards, or editorial slides
