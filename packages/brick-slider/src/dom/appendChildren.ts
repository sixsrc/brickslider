export function appendChildren(
  container: HTMLElement,
  children: HTMLElement[]
): void {
  children.forEach(element => {
    container.appendChild(element)
  })
}
