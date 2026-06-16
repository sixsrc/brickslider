# Tailwind Package

Structural Tailwind utilities and preset CSS for BrickSlider markup.

## Install

```bash
npm install @sixsrc/brick-slider @sixsrc/brick-slider-tailwind tailwindcss
```

## Setup

Add to your main stylesheet:

```css
@import "tailwindcss";
@import "@sixsrc/brick-slider-tailwind/preset.css";
@plugin "@sixsrc/brick-slider-tailwind";
```

## Visual States

The Tailwind package provides the structural layer for BrickSlider, but it does not force your visual theme for active slides or active dots.

Example:

```css
.active > .bs-content {
  @apply border border-violet-800 rounded-lg;
}

.bs-dot--active {
  @apply bg-violet-800 border border-violet-800;
}
```

If you are not using Tailwind, keep the same markup classes and style those states with plain CSS in your project.

## Stories Progress Theme

The Stories plugin also keeps the visual progress theme in your hands.

Example:

```css
.bs-stories-progress-item {
  @apply bg-white/20;
}

.bs-stories-progress-item--active {
  @apply bg-white/35;
}

.bs-stories-progress-item--completed {
  @apply bg-white/45;
}

.bs-stories-progress-bar {
  @apply bg-white;
}
```

## Class Reference

### Core

| Class | Description |
| ----- | ----------- |
| `bs-track` | Required viewport wrapper |
| `bs-container` | Required slide row |
| `bs-slide` | Required slide item |
| `bs-arrow` / `bs-prev` / `bs-next` | Arrow navigation |
| `bs-pages` | Page counter output |
| `bs-dots` / `bs-dot` | Pagination controls |
| `bs-progress` / `bs-progress-bar` | Progress rail |
| `bs-hidden` | Utility class before mount |
| `bs-peek` / `bs-peek-sm` / `bs-peek-lg` | Peek spacing variants |
| `bs-auto-height-layout` | Auto-height helper |

### Stories

| Class | Description |
| ----- | ----------- |
| `bs-stories-progress` | Progress rail container |
| `bs-stories-progress-item` | Progress segment |
| `bs-stories-progress-bar` | Animated bar |
| `bs-stories-pause-indicator` | Play/pause overlay |
| `bs-stories-pause` / `bs-stories-play` | Icon containers |
| `bs-stories-layer` | Overlay layer |
| `bs-stories-backdrop` | Backdrop element |
| `bs-stories-close` | Close button |
| `bs-stories-mute` | Mute button |
