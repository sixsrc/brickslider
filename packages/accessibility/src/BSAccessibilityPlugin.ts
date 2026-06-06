import { BaseSlider } from "../../slider/src/BaseSlider"
import { BSPlugin } from "../../slider/src/BSPlugin"
import {
  ATTRIBUTES,
  DOM_ELEMENT_ALIASES,
  EVENTS,
  TIMES,
  hasClass,
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
  SlideChangePayload,
  SyncAccessibilityParams
} from "./types"

export class BSAccessibilityPlugin extends BSPlugin {
  private dotCleanupCallbacks: Array<() => void> = []
  private readonly pluginOptions: ResolvedBSAccessibilityPluginOptions
  private rootCleanupCallback: (() => void) | null = null

  private readonly handleMounted = () => {
    this.syncAccessibilityWithDelay({ announce: true })
  }

  private readonly handleSlideChange = (_payload?: SlideChangePayload) => {
    this.syncAccessibilityWithDelay({ announce: true })
  }

  private readonly handleDestroyed = () => {
    this.destroy()
  }

  private readonly handleResize = () => {
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

    host.on("mounted", this.handleMounted)
    host.on("slideChange", this.handleSlideChange)
    host.on("destroyed", this.handleDestroyed)
    window.addEventListener(EVENTS.RESIZE, this.handleResize)
  }

  public destroy(): void {
    const host = this.host

    if (host) {
      host.off("mounted", this.handleMounted)
      host.off("slideChange", this.handleSlideChange)
      host.off("destroyed", this.handleDestroyed)
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
    const existingStyle = document.getElementById(A11Y_STYLE_ID)

    if (existingStyle) return

    const style = document.createElement("style")

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

    document.head.appendChild(style)
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

    if (!root) return

    const arrows = root.querySelectorAll<HTMLElement>(
      `.${DOM_ELEMENT_ALIASES.ARROW[0]}`
    )
    const rootId = root.getAttribute(ATTRIBUTES.ID)

    arrows.forEach(arrow => {
      const isPrevArrow = hasClass(arrow, DOM_ELEMENT_ALIASES.ARROW_PREV[0])
      const label = isPrevArrow
        ? this.pluginOptions.labels.previousSlide
        : this.pluginOptions.labels.nextSlide
      const isDisabled = this.isArrowDisabled(isPrevArrow ? "prev" : "next")

      setAttribute(arrow, ATTRIBUTES.ARIA_LABEL, label)
      setAttribute(arrow, ATTRIBUTES.TYPE, "button")
      setAttribute(arrow, ATTRIBUTES.ARIA_DISABLED, String(isDisabled))

      if (rootId) {
        setAttribute(arrow, ATTRIBUTES.ARIA_CONTROLS, rootId)
      }
    })
  }

  private setupDotsAccessibility(): void {
    const root = this.getRootSelector

    if (!root) return

    this.clearDotsAccessibility()

    const dotsContainer = root.querySelector<HTMLElement>(
      `.${DOM_ELEMENT_ALIASES.DOTS[0]}`
    )

    if (!dotsContainer) return

    const dots = Array.from(
      dotsContainer.querySelectorAll<HTMLElement>(
        `.${DOM_ELEMENT_ALIASES.DOT[0]}`
      )
    )
    const currentFocusedDot = this.getCurrentFocusedDot(dots)
    const rootId = root.getAttribute(ATTRIBUTES.ID)

    setAttribute(dotsContainer, ATTRIBUTES.ROLE, "navigation")
    setAttribute(
      dotsContainer,
      ATTRIBUTES.ARIA_LABEL,
      this.pluginOptions.labels.pagination
    )

    dots.forEach((dot, index) => {
      const isCurrent = hasClass(dot, DOM_ELEMENT_ALIASES.DOT_ACTIVE[0])
      const keydownHandler = (event: KeyboardEvent) => {
        if (
          event.key !== KEYBOARD_KEYS.ENTER &&
          event.key !== KEYBOARD_KEYS.SPACE
        ) {
          return
        }

        event.preventDefault()
        dot.click()
      }

      setAttribute(dot, ATTRIBUTES.ROLE, "button")
      setAttribute(dot, ATTRIBUTES.TABINDEX, isCurrent ? "0" : "-1")
      setAttribute(
        dot,
        ATTRIBUTES.ARIA_LABEL,
        this.pluginOptions.labels.page(index + 1)
      )

      if (rootId) {
        setAttribute(dot, ATTRIBUTES.ARIA_CONTROLS, rootId)
      }

      if (isCurrent) {
        setAttribute(dot, ATTRIBUTES.ARIA_CURRENT, "page")
      } else {
        dot.removeAttribute(ATTRIBUTES.ARIA_CURRENT)
      }

      dot.addEventListener(EVENTS.KEYDOWN, keydownHandler)
      this.dotCleanupCallbacks.push(() => {
        dot.removeEventListener(EVENTS.KEYDOWN, keydownHandler)
      })
    })

    if (
      this.pluginOptions.useFocusManagement &&
      currentFocusedDot !== null &&
      dots[currentFocusedDot]
    ) {
      const nextFocusedDot = dots.find(dot =>
        hasClass(dot, DOM_ELEMENT_ALIASES.DOT_ACTIVE[0])
      )

      nextFocusedDot?.focus()
    }
  }

  private syncSlidesAccessibility(): void {
    const slides = BaseSlider.getSlides(this.$root)
    const totalSlides = BaseSlider.getSlides(this.$root, false).length

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
    const existingLiveRegion = root.querySelector<HTMLElement>(
      `.${A11Y_LIVE_REGION_CLASS}`
    )

    if (existingLiveRegion) return

    const liveRegion = document.createElement("div")

    liveRegion.className = A11Y_LIVE_REGION_CLASS
    setAttribute(liveRegion, ATTRIBUTES.ARIA_LIVE, "polite")
    setAttribute(liveRegion, ATTRIBUTES.ARIA_ATOMIC, "true")

    root.appendChild(liveRegion)
  }

  private removeLiveRegion(): void {
    const root = this.getRootSelector

    if (!root) return

    root.querySelector(`.${A11Y_LIVE_REGION_CLASS}`)?.remove()
  }

  private updateLiveRegion(): void {
    const root = this.getRootSelector
    const liveRegion = root?.querySelector<HTMLElement>(
      `.${A11Y_LIVE_REGION_CLASS}`
    )

    if (!liveRegion) return

    liveRegion.textContent = this.getLiveRegionMessage()
  }

  private getLiveRegionMessage(): string {
    const slides = BaseSlider.getSlides(this.$root)
    const totalSlides = BaseSlider.getSlides(this.$root, false).length
    const visibleSlides = slides.filter(slide =>
      this.isSlideVisibleInViewport(slide)
    )

    if (visibleSlides.length === 0) {
      return this.pluginOptions.labels.liveRegionFallback(totalSlides)
    }

    const firstSlideNumber = this.getSlideNumber(visibleSlides[0], 0)
    const lastSlideNumber = this.getSlideNumber(
      visibleSlides[visibleSlides.length - 1],
      visibleSlides.length - 1
    )

    if (firstSlideNumber === lastSlideNumber) {
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

  private clearDotsAccessibility(): void {
    this.dotCleanupCallbacks.forEach(cleanup => cleanup())
    this.dotCleanupCallbacks = []
  }

  private setupKeyboardNavigation(): void {
    const root = this.getRootSelector

    if (!root) return

    this.clearRootAccessibility()

    if (!this.pluginOptions.useKeyboardNavigation) return

    const keydownHandler = (event: KeyboardEvent) => {
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

    if (!track) return false

    const slideRect = slide.getBoundingClientRect()
    const trackRect = track.getBoundingClientRect()
    const visibleWidth =
      Math.min(slideRect.right, trackRect.right) -
      Math.max(slideRect.left, trackRect.left)
    const safeVisibleWidth = Math.max(0, visibleWidth)
    const visibilityRatio =
      slideRect.width > 0 ? safeVisibleWidth / slideRect.width : 0

    return visibilityRatio >= MIN_VISIBLE_RATIO
  }

  private getRootAriaLabel(): string {
    return this.pluginOptions.labels.root
  }

  private getLastPageIndex(): number {
    const dotsContainer = this.getRootSelector?.querySelector<HTMLElement>(
      `.${DOM_ELEMENT_ALIASES.DOTS[0]}`
    )
    const dots = dotsContainer?.querySelectorAll(
      `.${DOM_ELEMENT_ALIASES.DOT[0]}`
    )

    return Math.max(0, (dots?.length ?? 1) - 1)
  }

  private isArrowDisabled(direction: "prev" | "next"): boolean {
    const { useLoop, activePage, numberOfPages, useDragFree } = this.store

    if (useLoop || useDragFree) return false
    if (direction === "prev") return activePage <= 0

    return activePage >= numberOfPages - 1
  }

  private getCurrentFocusedDot(dots: HTMLElement[]): number | null {
    const activeElement = document.activeElement

    if (!(activeElement instanceof HTMLElement)) return null

    const dotIndex = dots.indexOf(activeElement)

    return dotIndex >= 0 ? dotIndex : null
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
