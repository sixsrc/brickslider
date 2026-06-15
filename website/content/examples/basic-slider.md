# Basic Slider

The most direct starting point for BrickSlider.

## Live Example

:::example /examples/basic-slider/ 470

## Usage

```ts
import { BrickSlider } from "@sixsrc/brick-slider"

const slider = new BrickSlider("#slider", {
  slidesPerView: 1,
  slidesPerPage: 1,
  gap: 20,
  useLoop: false
})

slider.init()
```

## When to use

- Start here if you want the default paginated slider flow
- Good base for arrows, dots, pages, and progress
- Best first setup before enabling advanced options
