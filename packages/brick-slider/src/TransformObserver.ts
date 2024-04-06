import { getChildren } from "./helpers"

export class TransFormObserver {
  private observer: MutationObserver | null = null
  private translateThreshold: number
  private callback: () => void
  private $children: HTMLElement

  constructor($root: string, translateThreshold: number, callback: () => void) {
    this.$children = getChildren($root)
    this.translateThreshold = translateThreshold
    this.callback = callback

    this.observer = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          const transformValue = this.getTranslateValueFromStyle()
          if (transformValue >= this.translateThreshold) {
            this.callback()
          }
        }
      }
    })

    this.observe()
  }

  private observe() {
    const config = {
      attributes: true,
      attributeFilter: ["style"],
      subtree: true
    }
    this.observer?.observe(this.$children, config)
  }

  private getTranslateValueFromStyle(): number {
    const transformStyle = window.getComputedStyle(this.$children).transform
    const match = transformStyle.match(/matrix\(([^\)]+)\)/)
    if (match && match[1]) {
      const matrixValues = match[1].split(", ")
      if (matrixValues.length >= 6) {
        return parseFloat(matrixValues[4])
      }
    }
    return 0
  }

  disconnect() {
    this.observer?.disconnect()
  }
}
