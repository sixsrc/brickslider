export function isFirstSlideCloned(element: HTMLElement): boolean {
  const transformValue = element.style.transform
  return transformValue.includes("translate3d(0px, 0px, 0px)")
}
