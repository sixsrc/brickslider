export function $(element: string): HTMLElement {
  const selectedElement: HTMLElement | null = document.querySelector(element);
  if (!selectedElement) {
    throw new Error(`Element not found: ${element}`);
  }
  return selectedElement;
}

export function listener(
  event: string,
  target: EventTarget,
  callback: EventListenerOrEventListenerObject
): void {
  target.addEventListener(event, callback);
}

/*export function listener(
  event: string,
  target: EventTarget,
  callback: EventListenerOrEventListenerObject
) {
  target.addEventListener(event, function (event) {
    const button = event.target as HTMLElement;
    //const closestElement = button.closest(".slide1_images");
    const closestElement = button.closest("#slide1_container");
    const slideImages = closestElement!.querySelector(".slide1_images");
    console.log(slideImages);
    if (typeof callback === "function") {
      callback(event);
    }
  });
}*/

/*export function listener(
  event: string,
  target: EventTarget,
  callback: EventListenerOrEventListenerObject
) {
  target.addEventListener(event, function (event) {
    const button = event.target as HTMLElement;
    const parentElement = button.parentNode;
    console.log(parentElement);
    if (typeof callback === "function") {
      callback(event);
    }
  });
}*/
