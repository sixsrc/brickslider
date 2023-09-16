/* eslint-disable @typescript-eslint/no-explicit-any */
export function setStyle(el: HTMLElement, styleProp: any, value: string): void {
  el.style[styleProp] = value
}
