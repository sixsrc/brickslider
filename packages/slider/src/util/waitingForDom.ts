/*
const elements = [
  document.querySelector(".slide-1"),
  document.querySelector(".slide-2"),
  document.querySelector(".slide-3"),
];

waitingForDom(elements, () => {
  
});

const element = document.querySelector(".slide-1");
*/

/*export function waitingForDom<T extends Node>(elements: T[], callback: () => void): void {
  const observer = new MutationObserver(mutations => {
    const allElementsLoaded = mutations.reduce((loaded, mutation) => {
      const addedNodes = Array.from(mutation.addedNodes)
      return loaded && addedNodes.every(node => elements.some(element => element.isEqualNode(node)))
    }, true)

    if (allElementsLoaded) {
      callback()
    }
  })

  elements.forEach(element =>
    observer.observe(element, {
      childList: true,
      subtree: true
    })
  )
}*/

export function waitingForDom<T extends Node>(
  elements: T[],
  callback: (element: HTMLElement) => void
): void {
  const observer = new MutationObserver(mutations => {
    const allElementsLoaded = mutations.reduce((loaded, mutation) => {
      const addedNodes = Array.from(mutation.addedNodes)
      return loaded && addedNodes.every(node => elements.some(element => element.isEqualNode(node)))
    }, true)

    if (allElementsLoaded) {
      elements.forEach(element => {
        if (hasSpecificTransform(element as HTMLElement)) {
          callback(element as HTMLElement)
        }
      })
    }
  })

  elements.forEach(element =>
    observer.observe(element, {
      childList: true,
      subtree: true
    })
  )
}
