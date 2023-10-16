/* eslint-disable @typescript-eslint/no-explicit-any */
export function addClass(elements: (HTMLElement | Element)[], className: string): void {
  elements.forEach((el: any) => {
    el.classList.add(className)
  })
}
