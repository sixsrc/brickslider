# @sixsrc/brick-slider-stories

Stories plugin for BrickSlider.

See the main repository README for installation, markup, options, and examples:
- https://github.com/sixsrc/brickslider#stories-plugin

Core slider layout options such as `slidesPerView`, `slidesPerPage`, `gap`, `slideSizes`, `screens`, `responsive`, `useLoop`, `useDragFree`, and `useAutoHeight` are ignored by the stories flow.

## Quick usage

```ts
import StoriesPlugin from "@sixsrc/brick-slider-stories"
```

## TypeScript

```ts
import type { BrickSliderStoriesOptions } from "@sixsrc/brick-slider-stories"

const storiesOptions: BrickSliderStoriesOptions = {
  duration: 5000,
  maxStories: 10,
  closeOnEnd: true
}
```
