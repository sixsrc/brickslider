//import { forEach } from "./forEach";

export function appendChildren(
  container: HTMLElement,
  children: HTMLElement[]
): void {
  /*forEach(children, (element) => {
    container.appendChild(element);
  });*/
  children.forEach((element) => {
    container.appendChild(element);
  });
}
