import { addClass } from "../dom/methods/addClass";

export function cloneSlides(
  numberOfSlides: number,
  containerSlider: HTMLElement,
  clonedSlider: HTMLElement[]
): void {
  const firstSlide = containerSlider.children[0] as HTMLElement,
    //secondSlide = containerSlider.children[1] as HTMLElement,
    lastSlide = containerSlider.children[numberOfSlides - 1] as HTMLElement;

  const clonedFirstSlide = firstSlide.cloneNode(true) as HTMLElement,
    clonedLastSlide = lastSlide.cloneNode(true) as HTMLElement;

  addClass([clonedFirstSlide, clonedLastSlide], "cloned");

  containerSlider.insertBefore(clonedLastSlide, firstSlide);

  containerSlider.appendChild(clonedFirstSlide);

  //addClass([secondSlide], "active");

  //clonedSlider.unshift(clonedLastSlide);

  clonedSlider.push(clonedFirstSlide);
}
