# PerPage

Use `slidesPerPage` when you want navigation to advance in fixed groups.

## Live Example

:::example /examples/per-page/ 470

## Usage

```ts
import { BrickSlider } from "@sixsrc/brick-slider"

const slider = new BrickSlider("#slider", {
  slidesPerView: 3,
  slidesPerPage: 3,
  gap: 20,
  useLoop: true
})

slider.init()
```

## Notes

- `slidesPerView` controls how many slides stay visible
- `slidesPerPage` controls how many slides move per navigation step
- This is useful for product grids and grouped cards
