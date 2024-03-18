export function addClass(
  elements: (HTMLElement | Element)[],
  className: string
): void {
  elements.forEach(el => {
    el.classList.add(className)
  })
}
