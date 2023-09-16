/* eslint-disable @typescript-eslint/no-explicit-any */

export function hasAllClasses(
  el: HTMLElement,
  all: boolean,
  ...classes: string[]
) {
  return all
    ? classes.every((cls: string) => el.classList.contains(cls))
    : classes.some((cls: string) => el.classList.contains(cls))
}
