export class Observer {
  observedElement: HTMLElement
  callbacks: { [key: string]: Function }

  constructor(observedElement: HTMLElement) {
    this.observedElement = observedElement
    this.callbacks = {}
  }

  init(key: string, callback: Function) {
    this.callbacks[key] = callback
    this.initObservation()
  }

  initObservation() {
    if (this.isObserving()) {
      const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
          if (mutation.type === "attributes") {
            const translateValue = this.getTranslateValue()
            this.executeCallbacks(translateValue)
          }
        }
      })

      const config = { attributes: true, attributeFilter: ["style"] }
      observer.observe(this.observedElement, config as any)
    }
  }

  isObserving(): boolean {
    return Object.keys(this.callbacks).length > 0
  }

  getTranslateValue(): number {
    const style = window.getComputedStyle(this.observedElement)
    const transform = style.getPropertyValue("transform")
    const match = transform.match(/translate\((\S+)px,\s*(\S+)px\)/)
    if (match) {
      const [_, translate3d, translateY] = match
      return parseFloat(translate3d)
    }
    return 0
  }

  executeCallbacks(value: number) {
    for (const key in this.callbacks) {
      if (this.callbacks.hasOwnProperty(key)) {
        this.callbacks[key](value)
      }
    }
  }
}
