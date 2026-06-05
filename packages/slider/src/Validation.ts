import { DOM_ELEMENTS, TAGS } from "./helpers"
import { TypeOptions } from "./State"
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

  public sanitizeOptions(options?: TypeOptions): TypeOptions | undefined {
    if (!options) return options

    this.runValidations(options)
    return this.sanitizeSlideSizesOptions(options)
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

  public runValidations(options?: TypeOptions): void {
    const validations = [
      { c: () => !this.hasRootContainer(), id: "NO_ROOT" },
      { c: () => !this.hasTrackContainer(), id: "NO_TRACK" },
      { c: () => !this.hasChildrenContainer(), id: "NO_CHILDREN" },
      { c: () => !this.hasSlide(), id: "NO_SLIDES" },
      { c: () => this.hasDuplicateClasses(), id: "DUPLICATE_ELEMENTS" },
      { c: () => !this.hasAllElementsInOrder(), id: "INVALID_ORDER" },
      {
        c: () => this.hasUnsupportedSingleViewSlideSizes(options),
        id: "UNSUPPORTED_SLIDE_SIZES_SINGLE_VIEW"
      },
      {
        c: () => this.hasInvalidSlideSizesValues(options),
        id: "INVALID_SLIDE_SIZES_VALUES"
      }
    ]

    this.ids.clear()

    validations.forEach(({ c, id }) => {
      if (c()) this.ids.add(id)
    })
  }

  public getIds(): string[] {
    return Array.from(this.ids)
  }

  private isSlideSizesValid(slideSizes?: TypeOptions["slideSizes"]): boolean {
    if (!slideSizes) return true

    return !Object.entries(slideSizes).some(([key, value]) => {
      const numericKey = Number(key)

      return !this.isValidSlideSizeEntry(numericKey, value)
    })
  }

  private hasUnsupportedSingleViewSlideSizes(options?: TypeOptions): boolean {
    if (!options) return false

    const hasUnsupportedBaseSlideSizes =
      !!options.slideSizes && !this.isSlideSizesAllowed(options.slidesPerView)

    if (hasUnsupportedBaseSlideSizes) return true

    return Object.values(options.responsive ?? {}).some(config => {
      if (!config?.slideSizes) return false

      const effectiveSlidesPerView =
        config.slidesPerView ?? options.slidesPerView ?? 1

      return !this.isSlideSizesAllowed(effectiveSlidesPerView)
    })
  }

  private hasInvalidSlideSizesValues(options?: TypeOptions): boolean {
    if (!options) return false

    const hasInvalidBaseSlideSizes =
      !!options.slideSizes && this.isSlideSizesAllowed(options.slidesPerView)
        ? !this.isSlideSizesValid(options.slideSizes)
        : false

    if (hasInvalidBaseSlideSizes) return true

    return Object.values(options.responsive ?? {}).some(config => {
      if (!config?.slideSizes) return false

      const effectiveSlidesPerView =
        config.slidesPerView ?? options.slidesPerView ?? 1

      if (!this.isSlideSizesAllowed(effectiveSlidesPerView)) return false

      return !this.isSlideSizesValid(config.slideSizes)
    })
  }

  private sanitizeSlideSizesOptions(options: TypeOptions): TypeOptions {
    const sanitizedOptions: TypeOptions = { ...options }
    const isBaseSlideSizesAllowed = this.isSlideSizesAllowed(
      options.slidesPerView
    )
    const hasInvalidBaseSlideSizes =
      !isBaseSlideSizesAllowed || !this.isSlideSizesValid(options.slideSizes)

    if (hasInvalidBaseSlideSizes) {
      sanitizedOptions.slideSizes = undefined
    }

    if (!options.responsive) return sanitizedOptions

    sanitizedOptions.responsive = Object.entries(options.responsive).reduce(
      (acc, [breakpoint, config]) => {
        if (!config) {
          acc[breakpoint] = config
          return acc
        }

        const effectiveSlidesPerView =
          config.slidesPerView ?? options.slidesPerView ?? 1
        const hasInvalidResponsiveSlideSizes =
          !this.isSlideSizesAllowed(effectiveSlidesPerView) ||
          !this.isSlideSizesValid(config.slideSizes)

        acc[breakpoint] = hasInvalidResponsiveSlideSizes
          ? { ...config, slideSizes: undefined }
          : config

        return acc
      },
      {} as TypeOptions["responsive"]
    )

    return sanitizedOptions
  }

  private isSlideSizesAllowed(slidesPerView?: number): boolean {
    return (slidesPerView ?? 1) >= 2
  }

  private isValidSlideSizeEntry(position: number, value: unknown): boolean {
    return (
      Number.isInteger(position) &&
      position >= 0 &&
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0
    )
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
