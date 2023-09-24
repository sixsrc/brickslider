export function $(element: string): HTMLElement {
  const selectedElement: HTMLElement | null = document.querySelector(element)
  if (!selectedElement) {
    throw new Error(`Element not found: ${element}`)
  }
  return selectedElement
}

export function listener(
  event: string,
  target: EventTarget,
  callback: EventListenerOrEventListenerObject
): void {
  target.addEventListener(event, callback)
}

let initialTime: number

export function captureInitialTime() {
  initialTime = Date.now()
}

export function printFinalTime() {
  const finalTime = Date.now()
  const diferenceInMs = finalTime - initialTime
  console.log("Tempo final:", diferenceInMs, "milissegundos")
}
