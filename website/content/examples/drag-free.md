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

- `useDragFree` makes the track follow pointer/touch movement without snapping to pages after release.
- `useLoop` is ignored in drag-free mode. Keep `useLoop: false` to make the intent explicit.
- Dots and page labels are ignored because drag-free movement is not page based.
- Progress can still be used, but it becomes a track-position indicator instead of a page indicator.
- Use drag free for loose browsing experiences like horizontal galleries, media rails, and product rows.
