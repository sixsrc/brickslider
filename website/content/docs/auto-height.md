# BrickSlider Auto Height

This guide explains how to use the `useAutoHeight` option in BrickSlider.

## Overview

`useAutoHeight` allows the slider wrapper to adapt its height to the currently visible slide group instead of forcing all slides into the same fixed height.

This is especially useful when:

- slides have different heights
- the content height is controlled by CSS
- you want dots and arrows to follow the visible slide height

## Basic Usage

```ts
import { BrickSlider } from "@sixsrc/brick-slider"

const slider = new BrickSlider("#slider", {
  slidesPerView: 1,
  slidesPerPage: 1,
  useAutoHeight: true
})

slider.init()
```

## Important Concept

`useAutoHeight` does **not** define the slide height for you.

The slide height should still come from your markup or CSS.

BrickSlider only reads the visible slide height and updates the wrapper height to match it.

## Recommended Markup Pattern

For auto height examples, the content should define the height:

```html
<div id="slider" class="bs-hidden bs-auto-height-layout">
  <button class="bs-arrow bs-prev"></button>
  <button class="bs-arrow bs-next"></button>

  <div class="bs-track">
    <div class="bs-container">
      <div class="bs-slide">
        <span class="bs-content h-[140px]">01</span>
      </div>
      <div class="bs-slide">
        <span class="bs-content h-[220px]">02</span>
      </div>
      <div class="bs-slide">
        <span class="bs-content h-[320px]">03</span>
      </div>
    </div>
  </div>

  <ul class="bs-dots">
    <li class="bs-dot"></li>
  </ul>
</div>
```

## Recommended CSS Helper

Use the helper class:

- `bs-auto-height-layout`

This helper is intended for documentation examples and for projects where dots and arrows should follow the variable height layout more naturally.

## What `bs-auto-height-layout` Does

The helper class:

- reserves space for dots below the slider
- keeps arrows visually centered against the visible slide area
- avoids the fixed-height flex behavior that can make all slides feel equally tall
- works well with `useAutoHeight: true`

## Best Practice

Use both together:

- JavaScript option: `useAutoHeight: true`
- CSS helper: `bs-auto-height-layout`

## Notes

- if your wrapper has a fixed height in CSS, auto height will appear not to work
- if your dots use fixed `top-*` positioning, they may look detached from the slider height
- the content inside each slide should define the real height

## Summary

`useAutoHeight` makes the slider wrapper follow the visible content height.

It should be used together with content-driven slide heights and, when needed, the `bs-auto-height-layout` helper class for cleaner control positioning.
