# Stories Plugin

Turn a regular slider into an Instagram-style story modal with timed progress and video awareness.

## Install

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-stories
```

## Markup

Keep the stories controls in your HTML markup. The plugin handles state and behavior, but the progress rail, pause indicator, close button, and mute button should remain explicitly present in the DOM.

```html
<button id="open-stories" type="button">Open Stories</button>

<div id="stories-slider">
  <button class="bs-arrow bs-prev" type="button">Prev</button>
  <button class="bs-arrow bs-next" type="button">Next</button>

  <div class="bs-track">
    <div class="bs-container">
      <div class="bs-slide">Story 01</div>
      <div class="bs-slide">Story 02</div>
      <div class="bs-slide">Story 03</div>
    </div>

    <ul class="bs-stories-progress">
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

## Options

| Option | Description |
| ------ | ----------- |
| `trigger` | Element that opens the stories modal |
| `duration` | Duration in ms for non-video stories |
| `maxVideoDuration` | Maximum video duration clamp |
| `maxStories` | Maximum progress bars to show |
| `pauseOnHover` | Pauses on pointer hover (desktop) |
| `closeOnEnd` | Closes after last story |
| `useMuted` | Starts videos muted |

## Interactions

- **Space** — pause/resume the current story
- **Escape** — close the stories dialog
- **Hover** — pauses when `pauseOnHover` is enabled
- **Touch hold** — pause/resume on mobile

## Events

```ts
slider.on("storiesOpened", (rootSelector) => { ... })
slider.on("storiesMounted", (rootSelector) => { ... })
slider.on("storiesClosed", (rootSelector) => { ... })
```

## Troubleshooting

**Markup order:** Keep structure: arrows → \`bs-track\` → \`bs-container\` → stories elements → \`bs-stories-layer\`.

**Multiple videos:** Only the first video drives timed progress and mute state.
