# Progress

Use the progress rail when you want a visual sense of slider position.

## Live Example

:::example /examples/progress/ 520

## Required Markup

```html
<div class="bs-progress">
  <div class="bs-progress-bar"></div>
</div>
```

## Usage

```ts
import { BrickSlider } from "@sixsrc/brick-slider"

const slider = new BrickSlider("#slider", {
  slidesPerView: 1,
  slidesPerPage: 1,
  gap: 20,
  useLoop: true
})

slider.init()
```

## Notes

- The progress rail is driven by the built-in core behavior
- It works best on paginated sliders
- In loop mode, the bar follows the active real page
