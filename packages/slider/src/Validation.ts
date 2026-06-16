import {
  DOM_ELEMENT_ALIASES,
  NORMALIZED_ELEMENT_ROLES,
  RESPONSIVE_BREAKPOINTS,
  TAGS
} from "./helpers"
import {
  $,
  containsElement,
  getAllElements,
  getChildren,
  getElement,
  getRootSelector,
  getTrackChildren,
  hasClass,
  removePart
} from "./helpers"
import type { ResponsiveBreakpoint, SliderOptions } from "./types"

const FIXED_ORDER = [
  NORMALIZED_ELEMENT_ROLES.TRACK,
  NORMALIZED_ELEMENT_ROLES.CHILDREN,
  NORMALIZED_ELEMENT_ROLES.SLIDE
] as const

const ALLOWED_BEFORE_TRACK: readonly string[] = [
  NORMALIZED_ELEMENT_ROLES.ARROW,
  NORMALIZED_ELEMENT_ROLES.PAGES
]

export class Validation {
  protected readonly $root: string
  private ids: Set<string> = new Set<string>()
  private details: Record<string, string[]> = {}
  private arrElements: HTMLCollection | undefined

  constructor($root: string) {
    this.$root = $root
    this.arrElements = this.getRoot()?.children
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
    const firstSlide = firstChild
      ? getElement<HTMLElement>(`.${DOM_ELEMENT_ALIASES.SLIDE[0]}`, firstChild)
      : undefined

    if (!firstSlide) return []

    return [
      this.normalizeElementRole(element as HTMLElement) as string,
      this.normalizeElementRole(firstChild as HTMLElement) as string,
      this.normalizeElementRole(firstSlide as HTMLElement) as string
    ]
  }

  private normalizeElementRole(element?: HTMLElement): string | null {
    if (!element) return null
    if (this.hasAliasClass(element, DOM_ELEMENT_ALIASES.TRACK)) {
      return NORMALIZED_ELEMENT_ROLES.TRACK
    }
    if (this.hasAliasClass(element, DOM_ELEMENT_ALIASES.CHILDREN))
      return NORMALIZED_ELEMENT_ROLES.CHILDREN
    if (this.hasAliasClass(element, DOM_ELEMENT_ALIASES.SLIDE)) {
      return NORMALIZED_ELEMENT_ROLES.SLIDE
    }
    if (this.hasAliasClass(element, DOM_ELEMENT_ALIASES.ARROW))
      return NORMALIZED_ELEMENT_ROLES.ARROW
    if (this.hasAliasClass(element, DOM_ELEMENT_ALIASES.PAGES)) {
      return NORMALIZED_ELEMENT_ROLES.PAGES
    }

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
    const trackIndex = elementClasses.indexOf(NORMALIZED_ELEMENT_ROLES.TRACK)
    return removePart(elementClasses, 0, trackIndex)
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

  public sanitizeOptions(options?: SliderOptions): SliderOptions | undefined {
    if (!options) return options

    this.runValidations(options)
    return this.sanitizeDragFreeOptions(
      this.sanitizeResponsiveOptions(this.sanitizeSlideSizesOptions(options))
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
    const buttonLikeElements = Array.from(this.arrElements || []).slice(
      0,
      beforeTrack.length
    )
    const pageElements = buttonLikeElements.filter(element =>
      hasClass(element as HTMLElement, DOM_ELEMENT_ALIASES.PAGES[0])
    )
    const arrowButtons = buttons.filter(element =>
      hasClass(element as HTMLElement, DOM_ELEMENT_ALIASES.ARROW[0])
    )

    return (
      beforeTrack.length > 3 ||
      !beforeTrack.every(className => ALLOWED_BEFORE_TRACK.includes(className)) ||
      pageElements.length > 1 ||
      !arrowButtons.every(el => el.tagName.toLowerCase() === TAGS.BUTTON)
    )
  }

  private hasAllElementsInOrder(): boolean {
    const elementClasses = this.getElementClasses(this.arrElements)
    const trackIndex = elementClasses.indexOf(NORMALIZED_ELEMENT_ROLES.TRACK)
    const endArr =
      trackIndex >= 0 ? removePart(elementClasses, trackIndex, trackIndex + 3) : []

    if (this.isInvalidBeforeTrack()) return false

    return this.areArraysEqual(endArr, [...FIXED_ORDER])
  }

  private hasDuplicateClasses(): boolean {
    return this.getDuplicateClassNames().length > 0
  }

  public runValidations(options?: SliderOptions): void {
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
      },
      {
        c: () => this.hasResponsiveWithoutScreens(options),
        id: "RESPONSIVE_WITHOUT_SCREENS"
      },
      {
        c: () => this.hasInvalidScreenBreakpointKeys(options),
        id: "INVALID_SCREENS_BREAKPOINT_KEYS"
      },
      {
        c: () => this.hasInvalidResponsiveBreakpointKeys(options),
        id: "INVALID_RESPONSIVE_BREAKPOINT_KEYS"
      },
      {
        c: () => this.hasResponsiveBreakpointsMissingInScreens(options),
        id: "RESPONSIVE_BREAKPOINTS_MISSING_IN_SCREENS"
      },
      {
        c: () => this.hasDotsWithDragFree(options),
        id: "DRAG_FREE_WITH_DOTS"
      }
    ]

    this.ids.clear()
    this.details = {}

    validations.forEach(({ c, id }) => {
      if (c()) this.ids.add(id)
    })

    if (this.ids.has("DUPLICATE_ELEMENTS")) {
      this.details.DUPLICATE_ELEMENTS = this.getDuplicateClassNames()
    }

    if (this.ids.has("INVALID_ORDER")) {
      this.details.INVALID_ORDER = this.getInvalidOrderDetails()
    }

    const missingResponsiveBreakpoints =
      this.getResponsiveBreakpointsMissingInScreens(options)

    if (missingResponsiveBreakpoints.length > 0) {
      this.details.RESPONSIVE_BREAKPOINTS_MISSING_IN_SCREENS =
        missingResponsiveBreakpoints
    }
  }

  public getIds(): string[] {
    return Array.from(this.ids)
  }

  public getDetails(id: string): string[] {
    return this.details[id] ?? []
  }

  private getDuplicateClassNames(): string[] {
    const classCounts: Record<string, number> = {}
    const duplicateAliases = [
      ...DOM_ELEMENT_ALIASES.TRACK,
      ...DOM_ELEMENT_ALIASES.CHILDREN
    ]

    getAllElements(this.$root).forEach(el => {
      duplicateAliases.forEach(className => {
        if (hasClass(el as HTMLElement, className)) {
          classCounts[className] = (classCounts[className] ?? 0) + 1
        }
      })
    })

    return Object.entries(classCounts)
      .filter(([, count]) => count > 1)
      .map(([className]) => className)
  }

  private getInvalidOrderDetails(): string[] {
    const track = getTrackChildren(this.$root)
    const children = getChildren(this.$root)
    const beforeTrack = this.getBeforeTrack()
    const details: string[] = []
    const hasSlideInsideChildren = Boolean(
      children &&
        getElement<HTMLElement>(`.${DOM_ELEMENT_ALIASES.SLIDE[0]}`, children)
    )

    if (this.isInvalidBeforeTrack()) {
      details.push(
        `Optional arrows must be <button> elements, and .${DOM_ELEMENT_ALIASES.PAGES[0]} must stay before .${DOM_ELEMENT_ALIASES.TRACK[0]}.`
      )
    }

    if (children && track && !containsElement(track, children)) {
      details.push(
        `Found .${DOM_ELEMENT_ALIASES.CHILDREN[0]} outside .${DOM_ELEMENT_ALIASES.TRACK[0]}.`
      )
    }

    if (track && children && track.firstElementChild !== children) {
      details.push(
        `.${DOM_ELEMENT_ALIASES.CHILDREN[0]} must be the first child inside .${DOM_ELEMENT_ALIASES.TRACK[0]}.`
      )
    }

    if (children && !hasSlideInsideChildren) {
      details.push(
        `Could not find any .${DOM_ELEMENT_ALIASES.SLIDE[0]} inside .${DOM_ELEMENT_ALIASES.CHILDREN[0]}.`
      )
    }

    if (details.length === 0) {
      details.push(
        `Expected: .${DOM_ELEMENT_ALIASES.TRACK[0]} > .${DOM_ELEMENT_ALIASES.CHILDREN[0]} > .${DOM_ELEMENT_ALIASES.SLIDE[0]}.`
      )
    }

    return details
  }

  private isSlideSizesValid(slideSizes?: SliderOptions["slideSizes"]): boolean {
    if (!slideSizes) return true

    return !Object.entries(slideSizes).some(([key, value]) => {
      const numericKey = Number(key)

      return !this.isValidSlideSizeEntry(numericKey, value)
    })
  }

  private hasUnsupportedSingleViewSlideSizes(options?: SliderOptions): boolean {
    if (!options) return false

    const hasUnsupportedBaseSlideSizes =
      !!options.slideSizes && !this.isSlideSizesAllowed(options.slidesPerView)

    if (hasUnsupportedBaseSlideSizes) return true

    return Object.values(options.responsive ?? {}).some(config => {
      if (config?.useSlideSizes === false) return false
      if (!config?.slideSizes) return false

      const effectiveSlidesPerView =
        config.slidesPerView ?? options.slidesPerView ?? 1

      return !this.isSlideSizesAllowed(effectiveSlidesPerView)
    })
  }

  private hasInvalidSlideSizesValues(options?: SliderOptions): boolean {
    if (!options) return false

    const hasInvalidBaseSlideSizes =
      !!options.slideSizes && this.isSlideSizesAllowed(options.slidesPerView)
        ? !this.isSlideSizesValid(options.slideSizes)
        : false

    if (hasInvalidBaseSlideSizes) return true

    return Object.values(options.responsive ?? {}).some(config => {
      if (config?.useSlideSizes === false) return false
      if (!config?.slideSizes) return false

      const effectiveSlidesPerView =
        config.slidesPerView ?? options.slidesPerView ?? 1

      if (!this.isSlideSizesAllowed(effectiveSlidesPerView)) return false

      return !this.isSlideSizesValid(config.slideSizes)
    })
  }

  private sanitizeSlideSizesOptions(options: SliderOptions): SliderOptions {
    const sanitizedOptions: SliderOptions = { ...options }
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
          ;(acc as NonNullable<SliderOptions["responsive"]>)[
            breakpoint as keyof NonNullable<SliderOptions["responsive"]>
          ] = config
          return acc
        }

        if (config.useSlideSizes === false) {
          ;(acc as NonNullable<SliderOptions["responsive"]>)[
            breakpoint as keyof NonNullable<SliderOptions["responsive"]>
          ] = {
            ...config,
            slideSizes: undefined
          }
          return acc
        }

        const effectiveSlidesPerView =
          config.slidesPerView ?? options.slidesPerView ?? 1
        const hasInvalidResponsiveSlideSizes =
          !this.isSlideSizesAllowed(effectiveSlidesPerView) ||
          !this.isSlideSizesValid(config.slideSizes)

        ;(acc as NonNullable<SliderOptions["responsive"]>)[
          breakpoint as keyof NonNullable<SliderOptions["responsive"]>
        ] = hasInvalidResponsiveSlideSizes
          ? { ...config, slideSizes: undefined }
          : config

        return acc
      },
      {} as SliderOptions["responsive"]
    )

    return sanitizedOptions
  }

  private sanitizeResponsiveOptions(options: SliderOptions): SliderOptions {
    const sanitizedOptions: SliderOptions = { ...options }

    if (this.hasResponsiveWithoutScreens(options)) {
      sanitizedOptions.responsive = undefined
      return sanitizedOptions
    }

    if (options.screens) {
      sanitizedOptions.screens = Object.entries(options.screens).reduce(
        (acc, [breakpoint, value]) => {
          if (this.isSupportedBreakpoint(breakpoint)) {
            acc[breakpoint] = value
          }

          return acc
        },
        {} as NonNullable<SliderOptions["screens"]>
      )
    }

    if (options.responsive) {
      sanitizedOptions.responsive = Object.entries(options.responsive).reduce(
        (acc, [breakpoint, config]) => {
          if (
            this.isSupportedBreakpoint(breakpoint) &&
            this.hasScreenBreakpointValue(options.screens, breakpoint)
          ) {
            acc[breakpoint] = config
          }

          return acc
        },
        {} as NonNullable<SliderOptions["responsive"]>
      )
    }

    return sanitizedOptions
  }

  private sanitizeDragFreeOptions(options: SliderOptions): SliderOptions {
    if (!options.useDragFree) return options

    return {
      ...options,
      useLoop: false
    }
  }

  private hasDotsWithDragFree(options?: SliderOptions): boolean {
    if (!options?.useDragFree) return false

    return !!this.getDotsMarkup()
  }

  private getDotsMarkup(): HTMLElement | undefined {
    return $(`${this.$root} .${DOM_ELEMENT_ALIASES.DOTS[0]}`)
  }

  private hasResponsiveWithoutScreens(options?: SliderOptions): boolean {
    if (!options?.responsive || Object.keys(options.responsive).length === 0) {
      return false
    }

    return !options.screens || Object.keys(options.screens).length === 0
  }

  private hasInvalidScreenBreakpointKeys(options?: SliderOptions): boolean {
    if (!options?.screens) return false

    return Object.keys(options.screens).some(
      breakpoint => !this.isSupportedBreakpoint(breakpoint)
    )
  }

  private hasInvalidResponsiveBreakpointKeys(options?: SliderOptions): boolean {
    if (!options?.responsive) return false

    return Object.keys(options.responsive).some(
      breakpoint => !this.isSupportedBreakpoint(breakpoint)
    )
  }

  private hasResponsiveBreakpointsMissingInScreens(
    options?: SliderOptions
  ): boolean {
    return this.getResponsiveBreakpointsMissingInScreens(options).length > 0
  }

  private getResponsiveBreakpointsMissingInScreens(
    options?: SliderOptions
  ): string[] {
    if (!options?.responsive || !options.screens) return []

    return Object.keys(options.responsive).filter(
      breakpoint =>
        this.isSupportedBreakpoint(breakpoint) &&
        !this.hasScreenBreakpointValue(options.screens, breakpoint)
    )
  }

  private hasScreenBreakpointValue(
    screens: SliderOptions["screens"],
    breakpoint: ResponsiveBreakpoint
  ): boolean {
    if (!screens) return false

    const value = screens[breakpoint]

    return typeof value === "number" && Number.isFinite(value) && value >= 0
  }

  private isSupportedBreakpoint(
    breakpoint: string
  ): breakpoint is ResponsiveBreakpoint {
    return (RESPONSIVE_BREAKPOINTS as readonly string[]).includes(breakpoint)
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
