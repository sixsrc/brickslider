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

- Add only one `.bs-progress` element per slider. BrickSlider updates the nested `.bs-progress-bar` width as the active page changes.
- The width is based on pages, not individual slides. If `slidesPerPage` is `2`, each step represents one page jump.
- In loop mode, cloned slides are ignored, so the bar always reflects the real page position.
- The rail is structural only. Place it wherever your layout needs it and style the height, color, spacing, and rounded corners with CSS or Tailwind classes.
