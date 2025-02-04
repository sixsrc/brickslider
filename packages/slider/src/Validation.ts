import { DOM_ELEMENTS, TAGS } from "./constants"
import {
  $,
  getAllElements,
  getChildren,
  getRootSelector,
  getTrackChildren,
  hasClass,
  removePart
} from "./helpers"

export class Validation {
  private $root: string
  private ids: Set<string> = new Set<string>()
  private arrElements: HTMLCollection | undefined
  private fixedOrder: string[]

  constructor($root: string) {
    this.$root = $root
    this.arrElements = this.getRoot()?.children
    this.fixedOrder = this.getSliderClasses()
  }

  private getSliderClasses() {
    const { TRACK_SELECTOR, CHILDREN_SELECTOR, SINGLE_SLIDE } = DOM_ELEMENTS

    return [
      removePart(TRACK_SELECTOR, 1),
      removePart(CHILDREN_SELECTOR, 1),
      removePart(SINGLE_SLIDE, 1)
    ]
  }

  private getRoot(): HTMLElement | undefined {
    return getRootSelector(this.$root)
  }

  private getElementClasses(
    arrayElements: HTMLCollection | undefined
  ): string[] {
    const firstSlideClass = this.getSliderClasses()[0]

    if (!arrayElements) return []

    return Array.from(arrayElements).flatMap(element => {
      if (hasClass(element as HTMLElement, firstSlideClass))
        return this.getTrackClasses(element)

      return [element.classList[0]]
    })
  }

  private getTrackClasses(element: Element): string[] {
    const { SINGLE_SLIDE } = DOM_ELEMENTS
    const firstChild = element.children[0]
    const firstSlide = firstChild?.querySelector(SINGLE_SLIDE)

    if (!firstSlide) return []

    return [
      element.classList[0],
      firstChild.classList[0],
      firstSlide.classList[0]
    ]
  }

  private getButtonElements(): Element[] {
    return Array.from(this.arrElements || []).slice(
      0,
      this.getBeforeTrack().length
    )
  }

  private getBeforeTrack(): string[] {
    const elementClasses = this.getElementClasses(this.arrElements)
    const trackIndex = elementClasses.indexOf(this.getSliderClasses()[0])
    const arr = this.getElementClasses(this.arrElements)

    return removePart(arr, 0, trackIndex)
  }

  private areArraysEqual(arr1: string[], arr2: string[]): boolean {
    return (
      arr1.length === arr2.length &&
      arr1.every((value, index) => value === arr2[index])
    )
  }

  public isValid(): boolean {
    return (
      this.hasAllElements() &&
      this.hasAllElementsInOrder() &&
      !this.hasDuplicateClasses()
    )
  }

  private hasAllElements(): boolean {
    return [
      this.hasRootContainer(),
      this.hasTrackContainer(),
      this.hasChildrenContainer(),
      this.hasSlide()
    ].every(element => element !== undefined)
  }

  private isInvalidBeforeTrack(): boolean {
    const beforeTrack = this.getBeforeTrack()
    const buttons = this.getButtonElements()
    const { BRICK_ARROWS } = DOM_ELEMENTS
    const slider__arrows = removePart(BRICK_ARROWS, 1)

    return (
      beforeTrack.length > 2 ||
      !beforeTrack.every(className => className === slider__arrows) ||
      !buttons.every(el => el.tagName.toLowerCase() === TAGS.BUTTON)
    )
  }

  private hasAllElementsInOrder(): boolean {
    const elementClasses = this.getElementClasses(this.arrElements)
    const trackIndex = elementClasses.indexOf(this.getSliderClasses()[0])

    const endArr = removePart(elementClasses, trackIndex, trackIndex + 3)

    if (this.isInvalidBeforeTrack()) return false

    return this.areArraysEqual(endArr, this.fixedOrder)
  }

  private hasDuplicateClasses(): boolean {
    const classCounts: Record<string, number> = {}
    const arrClasses = [this.getSliderClasses()[0], this.getSliderClasses()[1]]

    getAllElements(this.$root).forEach(el => {
      arrClasses.forEach(className => {
        hasClass(el as HTMLElement, className)
      })
    })

    return Object.values(classCounts).some(count => count > 1)
  }

  public runValidations(): void {
    const validations = [
      { c: () => !this.hasRootContainer(), id: "NO_ROOT" },
      { c: () => !this.hasTrackContainer(), id: "NO_TRACK" },
      { c: () => !this.hasChildrenContainer(), id: "NO_CHILDREN" },
      { c: () => !this.hasSlide(), id: "NO_SLIDES" },
      { c: () => this.hasDuplicateClasses(), id: "DUPLICATE_ELEMENTS" },
      { c: () => !this.hasAllElementsInOrder(), id: "INVALID_ORDER" }
    ]

    this.ids.clear()

    const failedValidation = validations.find(({ c }) => c())

    if (failedValidation) this.ids.add(failedValidation.id)
  }

  public getIds(): string[] {
    return Array.from(this.ids)
  }

  protected hasRootContainer(): HTMLElement | undefined {
    return this.getRoot()
  }

  protected hasTrackContainer(): HTMLElement | undefined {
    return getTrackChildren(this.$root)
  }

  protected hasChildrenContainer(): HTMLElement | undefined {
    return getChildren(this.$root)
  }

  protected hasSlide(): HTMLElement | undefined {
    return $(
      `${this.$root} ${DOM_ELEMENTS.CHILDREN_SELECTOR} > ${DOM_ELEMENTS.SINGLE_SLIDE}`
    )
  }
}

// //if ()
//el.classList.contains(className)
