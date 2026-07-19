# Basic Configuration

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
    <li>
      <button class="bs-dot" type="button"></button>
    </li>
  </ul>

  <div class="bs-progress">
    <div class="bs-progress-bar"></div>
  </div>
</div>
```

## Slide Spacing

Use the `gap` option for spacing between slides.

Keep visual card spacing inside your slide content when you need custom design details. BrickSlider only needs the structural `bs-*` classes to identify the carousel parts.

## Active Dots

BrickSlider adds `bs-dot--active` to the current dot. You control the visual style.

### Plain CSS

```css
.bs-dot {
  width: 1.5rem;
  height: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  background: transparent;
}

.bs-dot::before {
  content: "";
  width: 0.75rem;
  height: 0.75rem;
  border: 1px solid #c4b5fd;
  border-radius: 999px;
  background: transparent;
}

.bs-dot--active::before {
  border-color: #6d28d9;
  background: #6d28d9;
}
```

### Tailwind

Keep the dot markup simple:

```html
<ul class="bs-dots flex gap-2">
  <li>
    <button
      class="bs-dot flex h-6 w-6 items-center justify-center rounded-full before:block before:h-3 before:w-3 before:rounded-full before:border-2 before:border-violet-700 before:bg-white hover:before:bg-violet-100"
      type="button"
    ></button>
  </li>
</ul>
```

Then define the active state in your Tailwind CSS entry:

```css
.bs-dot--active::before {
  @apply border-violet-700 bg-violet-700;
}
```

## Class Reference

| Class | Description |
| ----- | ----------- |
| `bs-track` | Core: required viewport wrapper |
| `bs-container` | Core: required slide row inside `bs-track` |
| `bs-slide` | Core: required slide item inside `bs-container` |
| `bs-arrow` / `bs-prev` / `bs-next` | Core: arrow navigation buttons |
| `bs-pages` | Core: optional current page output |
| `bs-dots` / `bs-dot` | Core: optional pagination controls |
| `bs-progress` / `bs-progress-bar` | Core: optional progress rail |
| `bs-hidden` | Core: utility class used before mount |
| `bs-peek` / `bs-peek-sm` / `bs-peek-lg` | Core: peek spacing variants |
| `bs-auto-height-layout` | Core: auto-height helper class |
| `bs-stories-progress` | Stories: progress rail container |
| `bs-stories-progress-item` | Stories: progress segment |
| `bs-stories-progress-bar` | Stories: animated bar inside segment |
| `bs-stories-pause-indicator` | Stories: play/pause overlay control |
| `bs-stories-pause` / `bs-stories-play` | Stories: pause/play icons |
| `bs-stories-layer` | Stories: overlay layer |
| `bs-stories-backdrop` | Stories: backdrop inside stories layer |
| `bs-stories-close` | Stories: close button |
| `bs-stories-mute` | Stories: mute button for video stories |
