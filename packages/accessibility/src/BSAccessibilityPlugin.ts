import { BSPlugin } from "../../slider/src/BSPlugin"
import {
  ATTRIBUTES,
  DOM_ELEMENT_ALIASES,
  EVENTS,
  FROM,
  SLIDER_EVENTS,
  TAGS,
  TIMES,
  $,
  appendToParent,
  createNewElement,
  getAllElements,
  getSliderNodeList,
  hasClass,
  removeAttribute,
  removeElement,
  setAttribute,
  waitFor
} from "../../slider/src/helpers"
import {
  A11Y_LIVE_REGION_CLASS,
  A11Y_STYLE_ID,
  KEYBOARD_KEYS,
  MIN_VISIBLE_RATIO
} from "./constants"
import type {
  BSAccessibilityPluginOptions,
  ResolvedAccessibilityLabels,
  ResolvedBSAccessibilityPluginOptions,
  SyncAccessibilityParams
} from "./types"

export class BSAccessibilityPlugin extends BSPlugin {
  private dotCleanupCallbacks: Array<() => void> = []
  private readonly pluginOptions: ResolvedBSAccessibilityPluginOptions
  private rootCleanupCallback: (() => void) | null = null

  private readonly handleMounted = (): void => {
    this.syncAccessibilityWithDelay({ announce: true })
  }

  private readonly handleSlideChange = (_payload?: unknown): void => {
    this.syncAccessibilityWithDelay({ announce: true })
  }

  private readonly handleDestroyed = (): void => {
    this.destroy()
  }

  private readonly handleResize = (): void => {
    waitFor(0, () => {
      this.syncAccessibilityWithDelay({ announce: false })
    })
  }

  constructor($root: string, options: BSAccessibilityPluginOptions = {}) {
    super($root)
    this.pluginOptions = this.resolveOptions(options)
  }

  public init(): void {
    const host = this.host

    if (!host) return

    this.ensureAccessibilityStyle()
    this.setupRootAccessibility()
    this.setupTrackAccessibility()
    this.setupArrowAccessibility()
    this.setupDotsAccessibility()
    this.setupKeyboardNavigation()

    host.on(SLIDER_EVENTS.MOUNTED, this.handleMounted)
    host.on(SLIDER_EVENTS.SLIDE_CHANGE, this.handleSlideChange)
    host.on(SLIDER_EVENTS.DESTROYED, this.handleDestroyed)
    window.addEventListener(EVENTS.RESIZE, this.handleResize)
  }

  public destroy(): void {
    const host = this.host

    if (host) {
      host.off(SLIDER_EVENTS.MOUNTED, this.handleMounted)
      host.off(SLIDER_EVENTS.SLIDE_CHANGE, this.handleSlideChange)
      host.off(SLIDER_EVENTS.DESTROYED, this.handleDestroyed)
    }

    this.clearDotsAccessibility()
    this.clearRootAccessibility()
    this.removeLiveRegion()
    window.removeEventListener(EVENTS.RESIZE, this.handleResize)
  }

  private syncAccessibility({
    announce = false
  }: SyncAccessibilityParams = {}): void {
    this.setupRootAccessibility()
    this.setupTrackAccessibility()
    this.setupArrowAccessibility()
    this.setupDotsAccessibility()
    this.setupKeyboardNavigation()
    this.syncSlidesAccessibility()

    if (announce) this.updateLiveRegion()
  }

  private syncAccessibilityWithDelay(
    params: SyncAccessibilityParams = {}
  ): void {
    const transitionDelay = TIMES.DEFAULT_TRANSITION_TIME + 50

    this.syncAccessibility(params)

    waitFor(0, () => {
      this.syncAccessibility(params)
    })

    waitFor(transitionDelay, () => {
      this.syncAccessibility(params)
    })
  }

  private ensureAccessibilityStyle(): void {
    const existingStyle = $(`#${A11Y_STYLE_ID}`)
    const style = this.createAccessibilityStyleElement()

    if (existingStyle) return

    appendToParent(document.head, style)
  }

  private createAccessibilityStyleElement(): HTMLStyleElement {
    const style = createNewElement(TAGS.STYLE) as HTMLStyleElement

    style.id = A11Y_STYLE_ID
    style.textContent = `
      .${A11Y_LIVE_REGION_CLASS} {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
    `

    return style
  }

  private setupRootAccessibility(): void {
    const root = this.getRootSelector

    if (!root) return

    if (!root.hasAttribute(ATTRIBUTES.ARIA_LABEL)) {
      setAttribute(root, ATTRIBUTES.ARIA_LABEL, this.getRootAriaLabel())
    }

    setAttribute(root, ATTRIBUTES.ROLE, "region")
    setAttribute(root, ATTRIBUTES.ARIA_ROLEDESCRIPTION, "carousel")
    setAttribute(root, ATTRIBUTES.TABINDEX, "0")
    this.ensureLiveRegion(root)
  }

  private setupTrackAccessibility(): void {
    const track = this.$track

    if (!track) return

    setAttribute(track, ATTRIBUTES.ARIA_LIVE, "polite")
    setAttribute(track, ATTRIBUTES.ARIA_ATOMIC, "true")
  }

  private setupArrowAccessibility(): void {
    const root = this.getRootSelector
    const arrows = root ? this.getArrowElements(root) : []
    const rootId = root?.getAttribute(ATTRIBUTES.ID)

    if (!root) return

    arrows.forEach(arrow => this.setupArrowElementAccessibility(arrow, rootId))
  }

  private setupArrowElementAccessibility(
    arrow: HTMLElement,
    rootId?: string | null
  ): void {
    const direction = this.getArrowDirection(arrow)
    const label = this.getArrowLabel(direction)
    const isDisabled = this.isArrowDisabled(direction)

    setAttribute(arrow, ATTRIBUTES.ARIA_LABEL, label)
    setAttribute(arrow, ATTRIBUTES.TYPE, "button")
    setAttribute(arrow, ATTRIBUTES.ARIA_DISABLED, String(isDisabled))
    this.setArrowControls(arrow, rootId)
  }

  private getArrowDirection(arrow: HTMLElement): typeof FROM.PREV | typeof FROM.NEXT {
    const isPrevArrow = hasClass(arrow, DOM_ELEMENT_ALIASES.ARROW_PREV[0])

    return isPrevArrow ? FROM.PREV : FROM.NEXT
  }

  private getArrowLabel(direction: typeof FROM.PREV | typeof FROM.NEXT): string {
    if (direction === FROM.PREV) return this.pluginOptions.labels.previousSlide

    return this.pluginOptions.labels.nextSlide
  }

  private setArrowControls(arrow: HTMLElement, rootId?: string | null): void {
    if (!rootId) return

    setAttribute(arrow, ATTRIBUTES.ARIA_CONTROLS, rootId)
  }

  private setupDotsAccessibility(): void {
    const root = this.getRootSelector
    const dotsContainer = this.getDotsContainerElement()
    const dots = dotsContainer ? this.getDotElements(dotsContainer) : []
    const currentFocusedDot = this.getCurrentFocusedDot(dots)
    const rootId = root?.getAttribute(ATTRIBUTES.ID)

    if (!root) return
    if (!dotsContainer) return

    this.clearDotsAccessibility()
    this.setupDotsContainerAccessibility(dotsContainer)
    this.setupDotsElementsAccessibility(dots, rootId)
    this.syncFocusedDot(dots, currentFocusedDot)
  }

  private setupDotsContainerAccessibility(dotsContainer: HTMLElement): void {
    setAttribute(dotsContainer, ATTRIBUTES.ROLE, "navigation")
    setAttribute(
      dotsContainer,
      ATTRIBUTES.ARIA_LABEL,
      this.pluginOptions.labels.pagination
    )
  }

  private setupDotsElementsAccessibility(
    dots: HTMLElement[],
    rootId?: string | null
  ): void {
    dots.forEach((dot, index) =>
      this.setupDotElementAccessibility(dot, index, rootId)
    )
  }

  private setupDotElementAccessibility(
    dot: HTMLElement,
    index: number,
    rootId?: string | null
  ): void {
    const isCurrent = hasClass(dot, DOM_ELEMENT_ALIASES.DOT_ACTIVE[0])
    const keydownHandler = this.createDotKeydownHandler(dot)

    setAttribute(dot, ATTRIBUTES.ROLE, "button")
    setAttribute(dot, ATTRIBUTES.TABINDEX, isCurrent ? "0" : "-1")
    setAttribute(
      dot,
      ATTRIBUTES.ARIA_LABEL,
      this.pluginOptions.labels.page(index + 1)
    )
    this.setDotControls(dot, rootId)
    this.setDotCurrentAttribute(dot, isCurrent)
    this.bindDotKeydown(dot, keydownHandler)
  }

  private createDotKeydownHandler(dot: HTMLElement): (event: KeyboardEvent) => void {
    return (event: KeyboardEvent): void => {
      this.handleDotKeydown(event, dot)
    }
  }

  private handleDotKeydown(event: KeyboardEvent, dot: HTMLElement): void {
    const isEnterKey = event.key === KEYBOARD_KEYS.ENTER
    const isSpaceKey = event.key === KEYBOARD_KEYS.SPACE
    const isActionKey = isEnterKey || isSpaceKey

    if (!isActionKey) return

    event.preventDefault()
    dot.click()
  }

  private setDotControls(dot: HTMLElement, rootId?: string | null): void {
    if (!rootId) return

    setAttribute(dot, ATTRIBUTES.ARIA_CONTROLS, rootId)
  }

  private setDotCurrentAttribute(dot: HTMLElement, isCurrent: boolean): void {
    if (isCurrent) {
      setAttribute(dot, ATTRIBUTES.ARIA_CURRENT, "page")
      return
    }

    removeAttribute(dot, ATTRIBUTES.ARIA_CURRENT)
  }

  private bindDotKeydown(
    dot: HTMLElement,
    keydownHandler: (event: KeyboardEvent) => void
  ): void {
    dot.addEventListener(EVENTS.KEYDOWN, keydownHandler)
    this.dotCleanupCallbacks.push(() => {
      dot.removeEventListener(EVENTS.KEYDOWN, keydownHandler)
    })
  }

  private syncFocusedDot(
    dots: HTMLElement[],
    currentFocusedDot: number | null
  ): void {
    const shouldFocusActiveDot = this.shouldFocusActiveDot(
      dots,
      currentFocusedDot
    )
    const nextFocusedDot = this.getActiveDot(dots)

    if (!shouldFocusActiveDot) return

    nextFocusedDot?.focus()
  }

  private shouldFocusActiveDot(
    dots: HTMLElement[],
    currentFocusedDot: number | null
  ): boolean {
    return (
      this.pluginOptions.useFocusManagement &&
      currentFocusedDot !== null &&
      dots[currentFocusedDot] !== undefined
    )
  }

  private getActiveDot(dots: HTMLElement[]): HTMLElement | undefined {
    return dots.find(dot => hasClass(dot, DOM_ELEMENT_ALIASES.DOT_ACTIVE[0]))
  }

  private syncSlidesAccessibility(): void {
    const slides = getSliderNodeList(this.$root)
    const totalSlides = getSliderNodeList(this.$root, false).length

    slides.forEach((slide, index) => {
      const isVisibleInViewport = this.isSlideVisibleInViewport(slide)

      this.setSlideAccessibility(slide, index, totalSlides, isVisibleInViewport)
    })
  }

  private setSlideAccessibility(
    slide: HTMLElement,
    fallbackIndex: number,
    totalSlides: number,
    isVisibleInViewport: boolean
  ): void {
    const slideNumber = this.getSlideNumber(slide, fallbackIndex)
    const shouldHideFromAssistiveTech = !isVisibleInViewport

    setAttribute(slide, ATTRIBUTES.ROLE, "group")
    setAttribute(slide, ATTRIBUTES.ARIA_ROLEDESCRIPTION, "slide")
    setAttribute(
      slide,
      ATTRIBUTES.ARIA_LABEL,
      this.pluginOptions.labels.slide(
        slideNumber,
        Math.max(totalSlides, slideNumber)
      )
    )
    setAttribute(
      slide,
      ATTRIBUTES.ARIA_HIDDEN,
      String(shouldHideFromAssistiveTech)
    )
  }

  private ensureLiveRegion(root: HTMLElement): void {
    const existingLiveRegion = this.getLiveRegionElement()
    const liveRegion = this.createLiveRegionElement()

    if (existingLiveRegion) return

    appendToParent(root, liveRegion)
  }

  private createLiveRegionElement(): HTMLElement {
    const liveRegion = createNewElement(TAGS.DIV)

    liveRegion.className = A11Y_LIVE_REGION_CLASS
    setAttribute(liveRegion, ATTRIBUTES.ARIA_LIVE, "polite")
    setAttribute(liveRegion, ATTRIBUTES.ARIA_ATOMIC, "true")

    return liveRegion
  }

  private removeLiveRegion(): void {
    const root = this.getRootSelector
    const liveRegion = this.getLiveRegionElement()

    if (!root) return

    removeElement(liveRegion)
  }

  private updateLiveRegion(): void {
    const liveRegion = this.getLiveRegionElement()

    if (!liveRegion) return

    liveRegion.textContent = this.getLiveRegionMessage()
  }

  private getLiveRegionMessage(): string {
    const totalSlides = getSliderNodeList(this.$root, false).length
    const visibleSlides = this.getVisibleSlidesForLiveRegion()
    const firstSlideNumber = this.getFirstLiveRegionSlideNumber(visibleSlides)
    const lastSlideNumber = this.getLastLiveRegionSlideNumber(visibleSlides)
    const hasVisibleSlides = visibleSlides.length > 0
    const hasSingleVisibleSlide = firstSlideNumber === lastSlideNumber

    if (!hasVisibleSlides) {
      return this.pluginOptions.labels.liveRegionFallback(totalSlides)
    }

    if (hasSingleVisibleSlide) {
      return this.pluginOptions.labels.liveRegionSingle(
        firstSlideNumber,
        totalSlides
      )
    }

    return this.pluginOptions.labels.liveRegionRange(
      firstSlideNumber,
      lastSlideNumber,
      totalSlides
    )
  }

  private getVisibleSlidesForLiveRegion(): HTMLElement[] {
    const slides = getSliderNodeList(this.$root)

    return slides.filter(slide => this.isSlideVisibleInViewport(slide))
  }

  private getFirstLiveRegionSlideNumber(visibleSlides: HTMLElement[]): number {
    return this.getSlideNumber(visibleSlides[0], 0)
  }

  private getLastLiveRegionSlideNumber(visibleSlides: HTMLElement[]): number {
    const lastVisibleSlideIndex = visibleSlides.length - 1

    return this.getSlideNumber(
      visibleSlides[lastVisibleSlideIndex],
      lastVisibleSlideIndex
    )
  }

  private clearDotsAccessibility(): void {
    this.dotCleanupCallbacks.forEach(cleanup => cleanup())
    this.dotCleanupCallbacks = []
  }

  private setupKeyboardNavigation(): void {
    const root = this.getRootSelector
    const keydownHandler = this.createKeyboardNavigationHandler()
    const useKeyboardNavigation = this.pluginOptions.useKeyboardNavigation

    if (!root) return
    if (!useKeyboardNavigation) return

    this.clearRootAccessibility()
    this.bindKeyboardNavigation(root, keydownHandler)
  }

  private createKeyboardNavigationHandler(): (event: KeyboardEvent) => void {
    return (event: KeyboardEvent): void => {
      this.handleKeyboardNavigation(event)
    }
  }

  private handleKeyboardNavigation(event: KeyboardEvent): void {
    const host = this.host

    if (!host) return

    if (event.key === KEYBOARD_KEYS.ARROW_LEFT) {
      event.preventDefault()
      host.prev()
      return
    }

    if (event.key === KEYBOARD_KEYS.ARROW_RIGHT) {
      event.preventDefault()
      host.next()
      return
    }

    if (event.key === KEYBOARD_KEYS.HOME) {
      event.preventDefault()
      host.goTo(0)
      return
    }

    if (event.key === KEYBOARD_KEYS.END) {
      event.preventDefault()
      host.goTo(this.getLastPageIndex())
    }
  }

  private bindKeyboardNavigation(
    root: HTMLElement,
    keydownHandler: (event: KeyboardEvent) => void
  ): void {
    root.addEventListener(EVENTS.KEYDOWN, keydownHandler)
    this.rootCleanupCallback = () => {
      root.removeEventListener(EVENTS.KEYDOWN, keydownHandler)
    }
  }

  private clearRootAccessibility(): void {
    this.rootCleanupCallback?.()
    this.rootCleanupCallback = null
  }

  private getSlideNumber(slide: HTMLElement, fallbackIndex: number): number {
    const dataIndex = Number(slide.dataset.index)

    if (Number.isInteger(dataIndex) && dataIndex > 0) return dataIndex

    return fallbackIndex + 1
  }

  private isSlideVisibleInViewport(slide: HTMLElement): boolean {
    const track = this.$track
    const slideRect = slide.getBoundingClientRect()
    const trackRect = this.getTrackRect(track)
    const visibleWidth = this.getVisibleSlideWidth(slideRect, trackRect)
    const safeVisibleWidth = Math.max(0, visibleWidth)
    const visibilityRatio = this.getVisibilityRatio(slideRect, safeVisibleWidth)
    const hasTrack = !!track

    if (!hasTrack) return false

    return visibilityRatio >= MIN_VISIBLE_RATIO
  }

  private getTrackRect(track: HTMLElement | undefined): DOMRect {
    return track?.getBoundingClientRect() ?? new DOMRect()
  }

  private getVisibleSlideWidth(slideRect: DOMRect, trackRect: DOMRect): number {
    return (
      Math.min(slideRect.right, trackRect.right) -
      Math.max(slideRect.left, trackRect.left)
    )
  }

  private getVisibilityRatio(
    slideRect: DOMRect,
    safeVisibleWidth: number
  ): number {
    return slideRect.width > 0 ? safeVisibleWidth / slideRect.width : 0
  }

  private getRootAriaLabel(): string {
    return this.pluginOptions.labels.root
  }

  private getLastPageIndex(): number {
    const dotsContainer = this.getDotsContainerElement()
    const dots = dotsContainer ? this.getDotElements(dotsContainer) : []

    return Math.max(0, dots.length - 1)
  }

  private getArrowElements(root: HTMLElement): NodeListOf<HTMLElement> {
    return getAllElements<HTMLElement>(
      `.${DOM_ELEMENT_ALIASES.ARROW[0]}`,
      root
    )
  }

  private getDotsContainerElement(): HTMLElement | undefined {
    return $(`${this.$root} .${DOM_ELEMENT_ALIASES.DOTS[0]}`)
  }

  private getDotElements(dotsContainer: HTMLElement): HTMLElement[] {
    return Array.from(
      getAllElements<HTMLElement>(
        `.${DOM_ELEMENT_ALIASES.DOT[0]}`,
        dotsContainer
      )
    )
  }

  private getLiveRegionElement(): HTMLElement | undefined {
    return $(`${this.$root} .${A11Y_LIVE_REGION_CLASS}`)
  }

  private isArrowDisabled(direction: typeof FROM.PREV | typeof FROM.NEXT): boolean {
    const { useLoop, activePage, numberOfPages, useDragFree } = this.store

    if (useLoop || useDragFree) return false
    if (direction === FROM.PREV) return activePage <= 0

    return activePage >= numberOfPages - 1
  }

  private getCurrentFocusedDot(dots: HTMLElement[]): number | null {
    const activeElement = document.activeElement
    const dotIndex = this.getFocusedDotIndex(dots, activeElement)

    if (!this.isValidDotIndex(dotIndex)) return null

    return dotIndex
  }

  private getFocusedDotIndex(
    dots: HTMLElement[],
    activeElement: Element | null
  ): number {
    if (!(activeElement instanceof HTMLElement)) return -1

    return dots.indexOf(activeElement)
  }

  private isValidDotIndex(dotIndex: number): boolean {
    return dotIndex >= 0
  }

  private resolveOptions(
    options: BSAccessibilityPluginOptions
  ): ResolvedBSAccessibilityPluginOptions {
    const defaultLabels: ResolvedAccessibilityLabels = {
      root: "BrickSlider carousel",
      pagination: "Slider pagination",
      previousSlide: "Previous slide",
      nextSlide: "Next slide",
      slide: (slideNumber, totalSlides) =>
        `Slide ${slideNumber} of ${totalSlides}`,
      page: pageNumber => `Go to page ${pageNumber}`,
      liveRegionSingle: (slideNumber, totalSlides) =>
        `Showing slide ${slideNumber} of ${totalSlides}.`,
      liveRegionRange: (firstSlideNumber, lastSlideNumber, totalSlides) =>
        `Showing slides ${firstSlideNumber} to ${lastSlideNumber} of ${totalSlides}.`,
      liveRegionFallback: totalSlides =>
        `Carousel updated. ${totalSlides} slides available.`
    }

    return {
      useKeyboardNavigation: options.useKeyboardNavigation ?? true,
      useFocusManagement: options.useFocusManagement ?? true,
      labels: {
        ...defaultLabels,
        ...options.labels
      }
    }
  }
}
