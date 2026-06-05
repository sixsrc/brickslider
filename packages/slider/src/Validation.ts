import { DOM_ELEMENT_ALIASES, DOM_ELEMENTS, TAGS } from "./helpers"
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
    this.fixedOrder = ["track", "children", "slide"]
  }

  private getSliderClasses() {
    return DOM_ELEMENT_ALIASES
  }

  private getRoot(): HTMLElement | undefined {
    return getRootSelector(this.$root)
  }

  private getElementClasses(
    arrayElements: HTMLCollection | undefined
  ): string[] {
    if (!arrayElements) return []

    return Array.from(arrayElements).flatMap(element => {
      if (this.isTrackElement(element as HTMLElement))
        return this.getTrackClasses(element)

      const normalizedClass = this.normalizeElementRole(element as HTMLElement)

      return normalizedClass ? [normalizedClass] : []
    })
  }

  private getTrackClasses(element: Element): string[] {
    const firstChild = element.children[0]
    const firstSlide = firstChild?.querySelector(`.${DOM_ELEMENT_ALIASES.SLIDE[0]}`)

    if (!firstSlide) return []

    return [
      this.normalizeElementRole(element as HTMLElement) as string,
      this.normalizeElementRole(firstChild as HTMLElement) as string,
      this.normalizeElementRole(firstSlide as HTMLElement) as string
    ]
  }

  private normalizeElementRole(element?: HTMLElement): string | null {
    if (!element) return null
    if (this.hasAliasClass(element, DOM_ELEMENT_ALIASES.TRACK)) return "track"
    if (this.hasAliasClass(element, DOM_ELEMENT_ALIASES.CHILDREN))
      return "children"
    if (this.hasAliasClass(element, DOM_ELEMENT_ALIASES.SLIDE)) return "slide"
    if (this.hasAliasClass(element, DOM_ELEMENT_ALIASES.ARROW)) return "bs-arrow"

    return element.classList[0] ?? null
  }

  private hasAliasClass(
    element: HTMLElement,
    aliases: readonly string[]
  ): boolean {
    return aliases.some(className => hasClass(element, className))
  }

  private isTrackElement(element: HTMLElement): boolean {
    return this.hasAliasClass(element, DOM_ELEMENT_ALIASES.TRACK)
  }

  private getButtonElements(): Element[] {
    return Array.from(this.arrElements || []).slice(
      0,
      this.getBeforeTrack().length
    )
  }

  private getBeforeTrack(): string[] {
    const elementClasses = this.getElementClasses(this.arrElements)
    const trackIndex = elementClasses.indexOf("track")
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

    return (
      beforeTrack.length > 2 ||
      !beforeTrack.every(className => className === "bs-arrow") ||
      !buttons.every(el => el.tagName.toLowerCase() === TAGS.BUTTON)
    )
  }

  private hasAllElementsInOrder(): boolean {
    const elementClasses = this.getElementClasses(this.arrElements)
    const trackIndex = elementClasses.indexOf("track")

    const endArr = removePart(elementClasses, trackIndex, trackIndex + 3)

    if (this.isInvalidBeforeTrack()) return false

    return this.areArraysEqual(endArr, this.fixedOrder)
  }

  private hasDuplicateClasses(): boolean {
    const classCounts: Record<string, number> = {}
    const arrClasses = [
      ...DOM_ELEMENT_ALIASES.TRACK,
      ...DOM_ELEMENT_ALIASES.CHILDREN
    ]

    getAllElements(this.$root).forEach(el => {
      arrClasses.forEach(className => {
        if (hasClass(el as HTMLElement, className)) {
          classCounts[className] = (classCounts[className] ?? 0) + 1
        }
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
      `${this.$root} .${DOM_ELEMENT_ALIASES.CHILDREN[0]} > .${DOM_ELEMENT_ALIASES.SLIDE[0]}`
    )
  }
}
