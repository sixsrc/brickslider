export function $(element: string): HTMLElement {
  const selectedElement: HTMLElement | null = document.querySelector(element)
  if (!selectedElement) {
    throw new Error(`Element not found: ${element}`)
  }
  return selectedElement
}
