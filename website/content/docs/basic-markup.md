# Basic Markup

## Required Elements

```html
<div id="slider">
  <button class="bs-arrow bs-prev" type="button">Prev</button>
  <button class="bs-arrow bs-next" type="button">Next</button>
  <div class="bs-pages"></div>

  <div class="bs-track">
    <div class="bs-container">
      <div class="bs-slide">Slide 01</div>
      <div class="bs-slide">Slide 02</div>
      <div class="bs-slide">Slide 03</div>
    </div>
  </div>

  <ul class="bs-dots">
    <li class="bs-dot"></li>
  </ul>

  <div class="bs-progress">
    <div class="bs-progress-bar"></div>
  </div>
</div>
```

## Class Reference

### Core

| Class | Description |
| ----- | ----------- |
| `bs-track` | Required viewport wrapper |
| `bs-container` | Required slide row inside `bs-track` |
| `bs-slide` | Required slide item inside `bs-container` |
| `bs-arrow` / `bs-prev` / `bs-next` | Arrow navigation buttons |
| `bs-pages` | Optional current page output |
| `bs-dots` / `bs-dot` | Optional pagination controls |
| `bs-progress` / `bs-progress-bar` | Optional progress rail |
| `bs-hidden` | Utility class used before mount |
| `bs-peek` / `bs-peek-sm` / `bs-peek-lg` | Peek spacing variants |
| `bs-auto-height-layout` | Auto-height helper class |

### Stories

| Class | Description |
| ----- | ----------- |
| `bs-stories-progress` | Stories progress rail container |
| `bs-stories-progress-item` | Stories progress segment |
| `bs-stories-progress-bar` | Animated bar inside segment |
| `bs-stories-pause-indicator` | Play/pause overlay control |
| `bs-stories-pause` / `bs-stories-play` | Pause/play icons |
| `bs-stories-layer` | Stories overlay layer |
| `bs-stories-backdrop` | Backdrop inside stories layer |
| `bs-stories-close` | Close button |
| `bs-stories-mute` | Mute button for video stories |