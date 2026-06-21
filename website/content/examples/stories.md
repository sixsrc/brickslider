# Stories

This example belongs to the separate `@sixsrc/brick-slider-stories` plugin.

## Live Example

:::example /examples/stories/ 760 nolink

## Install

```bash
pnpm add @sixsrc/brick-slider @sixsrc/brick-slider-stories
```

## Markup

The `trigger` option points to any element that should open the Stories modal.
It can be a button, card, thumbnail, avatar, or any selector you control.

```html
<button id="open-stories" type="button">
  Open Stories
</button>

<div id="stories-slider">
  <button class="bs-arrow bs-prev" type="button">Prev</button>
  <button class="bs-arrow bs-next" type="button">Next</button>

  <div class="bs-track">
    <div class="bs-container">
      <div class="bs-slide">
        <article class="bs-content">
          Story 01
        </article>
      </div>

      <div class="bs-slide">
        <article class="bs-content">
          Story 02
        </article>
      </div>

      <div class="bs-slide">
        <article class="bs-content">
          Story 03
        </article>
      </div>
    </div>

    <ul class="bs-stories-progress">
      <li class="bs-stories-progress-item">
        <span class="bs-stories-progress-bar"></span>
      </li>
      <li class="bs-stories-progress-item">
        <span class="bs-stories-progress-bar"></span>
      </li>
      <li class="bs-stories-progress-item">
        <span class="bs-stories-progress-bar"></span>
      </li>
    </ul>

    <button class="bs-stories-pause-indicator" type="button">
      <span class="bs-stories-pause">Pause</span>
      <span class="bs-stories-play hidden">Play</span>
    </button>
  </div>
</div>

<div class="bs-stories-layer hidden">
  <div class="bs-stories-backdrop"></div>
  <button class="bs-stories-close" type="button">Close</button>
  <button class="bs-stories-mute" type="button">Mute</button>
</div>
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
