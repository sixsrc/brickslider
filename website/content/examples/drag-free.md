# Drag Free

Use drag free when the track should move naturally without page snapping.

## Live Example

:::example /examples/drag-free/ 500

## Usage

```ts
import { BrickSlider } from "@sixsrc/brick-slider"

const slider = new BrickSlider("#slider", {
  slidesPerView: 3,
  slidesPerPage: 2,
  gap: 20,
  useDragFree: true,
  useLoop: false
})

slider.init()
```

## Notes

- Drag free is better for loose browsing than strict pagination
- Loop is typically less important in this mode
- Dots and progress are usually less meaningful here
