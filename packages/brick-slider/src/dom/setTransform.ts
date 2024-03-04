export function setTransform(el: HTMLElement, fn: () => number): void {
  el.style.transform = `translate3d(${fn()}px, 0, 0)`
}
