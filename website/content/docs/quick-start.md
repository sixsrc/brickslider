# Quick Start

## Basic Usage

```ts
import { BrickSlider } from "@sixsrc/brick-slider"

const slider = new BrickSlider("#slider", {
  slidesPerView: 1,
  slidesPerPage: 1,
  gap: 16,
  useLoop: false
})

slider.init()
```

## TypeScript

Public types are exported from the package entries, so IntelliSense works out of the box.

### Core

```ts
import { BrickSlider } from "@sixsrc/brick-slider"
import type {
  BrickSliderOptions,
  BrickSliderSlideChangePayload,
  ResponsiveBreakpoint,
  ResponsiveInput
} from "@sixsrc/brick-slider"

const slider = new BrickSlider("#slider", {
  slidesPerView: 1,
  slidesPerPage: 1
})

slider.on("slideChange", (payload: BrickSliderSlideChangePayload) => {
  console.log(payload.slideIndex, payload.activePage)
})
```

### Accessibility

```ts
import AccessibilityPlugin from "@sixsrc/brick-slider-accessibility"
import type { BrickSliderAccessibilityOptions } from "@sixsrc/brick-slider-accessibility"

slider.use(
  new AccessibilityPlugin({
    useKeyboardNavigation: true,
    useFocusManagement: true
  })
)
```

### Stories

```ts
import StoriesPlugin from "@sixsrc/brick-slider-stories"
import type { BrickSliderStoriesOptions } from "@sixsrc/brick-slider-stories"

slider.use(
  new StoriesPlugin({ duration: 5000, maxStories: 10, closeOnEnd: true })
)
```