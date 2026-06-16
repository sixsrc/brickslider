document.documentElement.classList.toggle(
  "example-embedded",
  window.top !== window.self
)

export function createSlides(container, total = 8) {
  for (let index = 0; index < total; index += 1) {
    const slide = document.createElement("div")
    slide.className = "bs-slide"
    slide.innerHTML = `
      <span class="example-slide-card">
        <span class="example-slide-label">${String(index + 1).padStart(2, "0")}</span>
      </span>
    `
    container.appendChild(slide)
  }
}

export function createAutoHeightSlides(container) {
  const sizes = ["short", "medium", "tall"]

  sizes.forEach((size, index) => {
    const slide = document.createElement("div")
    slide.className = "bs-slide"
    slide.innerHTML = `
      <span class="example-slide-card example-slide-card--${size}">
        <span class="example-slide-label">${String(index + 1).padStart(2, "0")}</span>
      </span>
    `
    container.appendChild(slide)
  })
}

export function mountSlider(selector, options) {
  const slider = new window.BrickSlider(selector, options)
  slider.init()
  return slider
}

export function arrowPrevSvg() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"></path></svg>`
}

export function arrowNextSvg() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>`
}
