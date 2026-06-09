import { BaseSlider } from "./BaseSlider"
import { Messages } from "./Messages"
import { Validation } from "./Validation"
import {
  ATTRIBUTES,
  DOM_ELEMENT_ALIASES,
  FROM,
  SLIDER_EVENTS,
  addClass,
  getSliderNodeList,
  getSlideMovement,
  isValidSelector,
  removeAttribute,
  removeClass,
  setAttribute
} from "./helpers"
import { Mount } from "./Mount"
import { Slider } from "./Slider"
import { Plugin } from "./Plugin"
import type { SliderOptions, StateType } from "./types"

export class BrickSlider extends BaseSlider {
  public userOptions?: SliderOptions
  private mount: Mount | null = null
  private plugins: Plugin[] = []
  private validate: Validation
  private message: Messages
  private readonly initialInnerHTML: string
  private readonly initialClassName: string
  private readonly initialStyle: string | null

  constructor($root: string, options?: SliderOptions) {
    super($root)
    this.initialInnerHTML = this.getInitialInnerHTML()
    this.initialClassName = this.getInitialClassName()
    this.initialStyle = this.getInitialStyle()
    this.validate = new Validation($root)
    this.message = new Messages($root)
    this.message.displayMessage(options)
    this.validation($root, this.validate.sanitizeOptions(options))
  }

  private validation($root: string, options?: SliderOptions): void {
    const isValid = isValidSelector($root) && this.validate.isValid()

    if (isValid) this.defineConfigs($root, options)
  }

  private defineConfigs($root: string, options?: SliderOptions): void {
    this.userOptions = options
    this.mount = new Mount($root)
    this.setOptions(options)
  }

  private setOptions(options: SliderOptions | undefined): void {
    const userOptions = this.userOptions

    if (!options || !userOptions) return

    this.state.setOptions(userOptions)
  }

  public init(): void {
    this.clearDestroyedState()
    this.mount?.init()
    this.emitMountedWhenReady()
  }

  private emitMountedWhenReady(): void {
    const rootSelector = this.getRootSelector

    if (!rootSelector) return

    let observer: MutationObserver | null = null
    let isMountedEventDispatched = false
    let pendingFrame = 0
    let attempts = 0
    const maxAttempts = 30

    const disconnectObserver = (): void => {
      observer?.disconnect()
      observer = null
    }

    const emitMounted = (): void => {
      if (isMountedEventDispatched) return

      isMountedEventDispatched = true
      disconnectObserver()
      this.emit(SLIDER_EVENTS.MOUNTED, this.$root)
    }

    const hasMountedDomStructure = (): boolean => {
      const track = rootSelector.querySelector<HTMLElement>(
        `.${DOM_ELEMENT_ALIASES.TRACK[0]}`
      )
      const children = track?.querySelector<HTMLElement>(
        `.${DOM_ELEMENT_ALIASES.CHILDREN[0]}`
      )
      const slides = getSliderNodeList(this.$root)
      const firstSlide = slides[0]
      const rootWidth = rootSelector.getBoundingClientRect().width
      const isHidden = rootSelector.classList.contains(
        DOM_ELEMENT_ALIASES.HIDDEN[0]
      )

      if (!track || !children || slides.length === 0) return false
      if (isHidden || rootWidth <= 0) return false

      return (firstSlide?.getBoundingClientRect().width ?? 0) > 0
    }

    const scheduleMountedCheck = (): void => {
      if (isMountedEventDispatched || pendingFrame) return

      pendingFrame = requestAnimationFrame(() => {
        pendingFrame = 0
        attempts += 1

        if (hasMountedDomStructure()) {
          requestAnimationFrame(() => emitMounted())
          return
        }

        if (attempts < maxAttempts) {
          scheduleMountedCheck()
          return
        }

        emitMounted()
      })
    }

    observer = new MutationObserver(() => {
      scheduleMountedCheck()
    })

    observer.observe(rootSelector, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [ATTRIBUTES.CLASS, ATTRIBUTES.STYLE]
    })

    scheduleMountedCheck()
  }

  public next(): void {
    this.navigate(FROM.NEXT)
  }

  public prev(): void {
    this.navigate(FROM.PREV)
  }

  public goTo(index: number): void {
    const { useDragFree } = this.store

    if (!this.canInteract()) return

    if (useDragFree) {
      this.message.displayDragFreeGoToIgnored()
      return
    }

    if (!Number.isFinite(index)) {
      this.message.displayInvalidGoToIndex(index)
      return
    }

    this.getSlider().goToPageIndex(index)
  }

  public destroy(): void {
    const rootSelector = this.getRootSelector

    if (!rootSelector) return

    this.destroyPlugins()
    this.restoreRootElement(rootSelector)
    this.resetMountState()
    this.emit(SLIDER_EVENTS.DESTROYED, this.$root)
  }

  public use(plugin: Plugin): void {
    const pluginName = this.getPluginName(plugin)
    const isValidPlugin = this.isValidPluginType(plugin)

    if (!isValidPlugin) {
      this.message.displayInvalidPluginType()
      return
    }

    if (plugin.usesExplicitRoot() && !this.isMatchingPluginRoot(plugin)) {
      this.message.displayPluginRootMismatch(pluginName)
      return
    }

    plugin.setHost(this)
    plugin.init()
    this.plugins.push(plugin)
  }

  private canInteract(): boolean {
    return !!this.mount && !!this.getRootSelector
  }

  private destroyPlugins(): void {
    this.plugins.forEach(plugin => {
      plugin.destroy()
    })

    this.plugins = []
  }

  private getSlider(): Slider {
    return new Slider(this.$root)
  }

  private getPluginName(plugin: Plugin): string {
    return plugin.constructor?.name ?? "UnknownPlugin"
  }

  private isValidPluginType(plugin: unknown): plugin is Plugin {
    return plugin instanceof Plugin
  }

  private isMatchingPluginRoot(plugin: Plugin): boolean {
    return plugin.getPluginRoot() === this.$root
  }

  private getInitialInnerHTML(): string {
    return this.getRootSelector?.innerHTML ?? ""
  }

  private getInitialClassName(): string {
    return this.getRootSelector?.className ?? ""
  }

  private getInitialStyle(): string | null {
    return this.getRootSelector?.getAttribute(ATTRIBUTES.STYLE) ?? null
  }

  private navigate(direction: typeof FROM.NEXT | typeof FROM.PREV): void {
    const { useDragFree } = this.store

    if (!this.canInteract()) return
    if (useDragFree) {
      this.getSlider().goToFreeDirection(direction)
      return
    }

    this.setState(this.getNavigationState(direction))
    this.getSlider().setSlideTarget({ $root: this.$root, from: direction })
  }

  private getNavigationState(
    direction: typeof FROM.NEXT | typeof FROM.PREV
  ): Partial<StateType> {
    const { slideIndex } = this.store
    const currentSlideMovement = getSlideMovement(direction)

    return {
      currentSlideMovement,
      prevSlideIndex: slideIndex,
      currentEventType: direction,
      startPos: Infinity
    }
  }

  private restoreRootElement(rootSelector: HTMLElement): void {
    const { initialInnerHTML, initialClassName, initialStyle } = this
    const rootSnapshot = {
      innerHTML: initialInnerHTML,
      className: initialClassName,
      style: initialStyle
    }

    rootSelector.innerHTML = rootSnapshot.innerHTML
    rootSelector.className = rootSnapshot.className
    this.restoreRootStyle(rootSelector, rootSnapshot.style)
    this.restoreRootVisibility(rootSelector)
    this.applyDestroyedMarkupFallback(rootSelector)
  }

  private restoreRootStyle(
    rootSelector: HTMLElement,
    style: string | null
  ): void {
    if (style === null) {
      removeAttribute(rootSelector, ATTRIBUTES.STYLE)
      return
    }

    setAttribute(rootSelector, ATTRIBUTES.STYLE, style)
  }

  private restoreRootVisibility(rootSelector: HTMLElement): void {
    removeClass(rootSelector, DOM_ELEMENT_ALIASES.HIDDEN[0])
  }

  private applyDestroyedMarkupFallback(rootSelector: HTMLElement): void {
    addClass([rootSelector], DOM_ELEMENT_ALIASES.DESTROYED[0])
  }

  private clearDestroyedState(): void {
    const rootSelector = this.getRootSelector

    if (!rootSelector) return

    removeClass(rootSelector, DOM_ELEMENT_ALIASES.DESTROYED[0])
  }

  private resetMountState(): void {
    const { userOptions } = this

    if (!userOptions) {
      this.mount = null
      return
    }

    this.mount = new Mount(this.$root)
    this.setOptions(userOptions)
  }
}
