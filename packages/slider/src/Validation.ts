import { DOM_ELEMENTS } from "./constants"
import { $, getChildren, getRootSelector, getTrackChildren } from "./helpers"

export class Validation {
  $root: string
  constructor($root: string) {
    this.$root = $root
  }

  private getRoot($root: string): HTMLElement | undefined {
    return getRootSelector(this.$root)
  }

  protected elements(): (HTMLElement | undefined)[] {
    const elements = [
      this.hasRootContainer(),
      this.hasTrackContainer(),
      this.hasChildrenContainer(),
      this.hasSlide()
    ]
    return elements
  }

  public isValid(): boolean {
    return (
      this.elements().every(this.hasAllElements()) &&
      this.hasAllElementsInOrder() &&
      !this.hasDuplicateElements()
    )
  }

  protected hasRootContainer(): HTMLElement | undefined {
    const element = getRootSelector(this.$root)

    return element
  }

  protected hasTrackContainer() {
    const element = getTrackChildren(this.$root)

    return element
  }

  protected hasChildrenContainer() {
    const element = getChildren(this.$root)

    return element
  }

  protected hasSlide() {
    const element = $(
      `${this.$root} ${DOM_ELEMENTS.CHILDREN_SELECTOR} > ${DOM_ELEMENTS.SINGLE_SLIDE}`
    )

    return element
  }

  private hasAllElements() {
    const elements = (element: HTMLElement | undefined): boolean =>
      element !== undefined

    return elements
  }

  protected hasAllElementsInOrder() {
    const arrayElements = this.getRoot(this.$root)?.children
    const fixedOrder = ["slider__track", "slider__container", "slider__slide"]

    const classesArray = Array.from(arrayElements || [])
      .map(element => {
        if (element.classList[0] === "slider__track") {
          const firstChild = element.children[0]
          const firstSlide = firstChild?.querySelector(".slider__slide")

          // Se não encontrar slider__slide, retorna array vazio para invalidar
          if (!firstSlide) return []

          return [
            element.classList[0],
            firstChild?.classList[0],
            firstSlide?.classList[0]
          ]
        }
        return element.classList[0]
      })
      .flat()

    const trackIndex = classesArray.indexOf("slider__track")
    if (trackIndex === -1) return false

    const beforeTrack = classesArray.slice(0, trackIndex)
    if (beforeTrack.length > 2) return false

    if (beforeTrack.length > 0) {
      const allArrows = beforeTrack.every(
        className => className === "slider__arrows"
      )
      if (!allArrows) return false

      const arrowElements = Array.from(arrayElements || []).slice(
        0,
        beforeTrack.length
      )
      const allButtons = arrowElements.every(
        element => element.tagName.toLowerCase() === "button"
      )
      if (!allButtons) return false
    }

    const finalArray = classesArray.slice(trackIndex, trackIndex + 3)
    return JSON.stringify(finalArray) === JSON.stringify(fixedOrder)
  }

  protected hasDuplicateElements(): boolean {
    // Obtem o elemento root
    const root = this.getRoot(this.$root)
    if (!root) return false

    // Classes que precisamos verificar
    const classesToCheck = ["slider__track", "slider__container"]

    // Contador para ocorrências das classes
    const classCounts: Record<string, number> = {}

    // Itera sobre todos os elementos filhos dentro do root
    root.querySelectorAll("*").forEach(element => {
      classesToCheck.forEach(className => {
        if (element.classList.contains(className)) {
          classCounts[className] = (classCounts[className] || 0) + 1
        }
      })
    })

    // Retorna true se qualquer uma das classes tiver mais de uma ocorrência
    return Object.values(classCounts).some(count => count > 1)
  }
}
