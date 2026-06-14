# Accessibility Plugin

Dedicated plugin for accessibility helpers and screen reader announcements.

## Install

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-accessibility
```

## Usage

```ts
import { BrickSlider } from "@sixsrc/brick-slider"
import AccessibilityPlugin from "@sixsrc/brick-slider-accessibility"

const slider = new BrickSlider("#slider", {
  slidesPerView: 1,
  slidesPerPage: 1
})

slider.use(
  new AccessibilityPlugin({
    useKeyboardNavigation: true,
    useFocusManagement: true,
    labels: {
      root: "Featured products carousel",
      pagination: "Featured products pagination",
      previousSlide: "Show previous product",
      nextSlide: "Show next product",
      slide: (slideNumber, totalSlides) => `Product ${slideNumber} of ${totalSlides}`,
      page: pageNumber => `Go to page ${pageNumber}`,
      liveRegionSingle: (slideNumber, totalSlides) => `Showing product ${slideNumber} of ${totalSlides}`,
      liveRegionRange: (first, last, total) => `Showing products ${first} to ${last} of ${total}`,
      liveRegionFallback: total => `Carousel updated. ${total} slides available.`
    }
  })
)

slider.init()
```

## What it adds

- Accessible labels for arrows, dots, and slides
- A live region for screen reader announcements
- Keyboard navigation on the slider root
- Focus alignment with the active page

## Options

### `useKeyboardNavigation`

Enables arrow-key navigation on the slider root.

### `useFocusManagement`

Moves focus to the active pagination control when appropriate.

### `labels`

Overrides all accessible strings including slide labels and live region messages.

## Notes

- Attach before calling `slider.init()`
- Works with both regular sliders and stories-enhanced sliders
- If arrows or dots are missing from markup, the plugin cannot label them