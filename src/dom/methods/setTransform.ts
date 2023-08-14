export function setTransform(el: HTMLElement, fn: () => number): void {
  el.style.transform = `translateX(${fn()}px)`;
}
