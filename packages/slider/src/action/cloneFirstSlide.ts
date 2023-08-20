export function cloneFirstSlide(slides: HTMLElement[]) {
  const firstSlide = slides[0],
    clonedSlide = firstSlide.cloneNode(true) as HTMLElement,
    thirdSlide = slides[3],
    parent = thirdSlide.parentNode;

  parent?.insertBefore(clonedSlide, thirdSlide.nextSibling);
}
