# React Quick Start

This is a minimal example of using BrickSlider in React without any wrapper package.

## Install

```bash
pnpm add @sixsrc/brick-slider
```

```bash
npm install @sixsrc/brick-slider
```

## Component Example

```tsx
import { useEffect, useRef } from "react"
import { BrickSlider } from "@sixsrc/brick-slider"

export function ProductCarousel(): JSX.Element {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const sliderId = "product-carousel"

  useEffect(() => {
    if (!rootRef.current) return

    const slider = new BrickSlider(`#${sliderId}`, {
      slidesPerView: 1,
      slidesPerPage: 1,
      gap: 16,
      useLoop: false,
    })

    slider.init()

    return () => {
      slider.destroy()
    }
  }, [])

  return (
    <div id={sliderId} ref={rootRef}>
      <button className="bs-arrow bs-prev" type="button">
        Prev
      </button>
      <button className="bs-arrow bs-next" type="button">
        Next
      </button>

      <div className="bs-track">
        <div className="bs-container">
          <div className="bs-slide">Slide 01</div>
          <div className="bs-slide">Slide 02</div>
          <div className="bs-slide">Slide 03</div>
        </div>
      </div>

      <ul className="bs-dots">
        <li className="bs-dot"></li>
      </ul>
    </div>
  )
}
```

## Notes

- BrickSlider works with the same markup structure used in vanilla JavaScript.
- The slider is mounted inside `useEffect()` so the DOM is ready.
- The current core API receives a selector string, so the example uses a stable `id`.
- Always call `destroy()` in the cleanup function when the component unmounts.
- You can expand this setup later with plugins, responsive options, progress bars, and page counters.
