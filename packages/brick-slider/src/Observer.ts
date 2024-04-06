export class Observer {
  observedElement: HTMLElement
  callbacks: { [key: string]: Function }

  constructor(observedElement: HTMLElement) {
    this.observedElement = observedElement
    this.callbacks = {}
  }

  // Método para associar um callback a uma chave específica
  init(key: string, callback: Function) {
    this.callbacks[key] = callback
    this.initObservation()
  }

  // Método para observar mudanças e chamar os callbacks associados
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

  // Método para verificar se já está observando
  isObserving(): boolean {
    return Object.keys(this.callbacks).length > 0
  }

  // Método para obter o valor do translate
  getTranslateValue(): number {
    const style = window.getComputedStyle(this.observedElement)
    const transform = style.getPropertyValue("transform")
    const match = transform.match(/translate\((\S+)px,\s*(\S+)px\)/)
    if (match) {
      const [_, translateX, translateY] = match
      return parseFloat(translateX)
    }
    return 0
  }

  // Método para executar os callbacks associados
  executeCallbacks(value: number) {
    for (const key in this.callbacks) {
      if (this.callbacks.hasOwnProperty(key)) {
        this.callbacks[key](value)
      }
    }
  }
}
