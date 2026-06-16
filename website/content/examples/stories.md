# Stories

This example belongs to the separate `@sixsrc/brick-slider-stories` plugin.

## Live Example

:::example /examples/stories/ 760 nolink

## Install

```bash
pnpm add @sixsrc/brick-slider @sixsrc/brick-slider-stories
```

## Usage

```ts
import { BrickSlider } from "@sixsrc/brick-slider"
import StoriesPlugin from "@sixsrc/brick-slider-stories"

const slider = new BrickSlider("#stories-slider", {
  slidesPerView: 1,
  slidesPerPage: 1,
  useLoop: false
})

slider.use(
  new StoriesPlugin({
    trigger: "#open-stories",
    duration: 5000,
    maxVideoDuration: 60000,
    maxStories: 10,
    closeOnEnd: true,
    pauseOnHover: true,
    useMuted: true
  })
)

slider.init()
```

## Notes

- Stories ignores several core layout options internally
- Use it for story-style modal flows, timed progress, and media playback
- Keep the required Stories markup structure from the plugin docs
