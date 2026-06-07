import { BaseSlider } from "./BaseSlider"
import { Messages } from "./Messages"
import { Validation } from "./Validation"
import {
  ATTRIBUTES,
  DOM_ELEMENT_ALIASES,
  FROM,
  SLIDER_EVENTS,
  addClass,
  getSlideMovement,
  isValidSelector,
  removeAttribute,
  removeClass,
  setAttribute,
  waitFor
} from "./helpers"
import { Mount } from "./Mount"
import { Slider } from "./Slider"
import { BSPlugin } from "./BSPlugin"
import type { SliderOptions, StateType } from "./types"

export class BrickSlider extends BaseSlider {
  public userOptions?: SliderOptions
  private mount: Mount | null = null
  private plugins: BSPlugin[] = []
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
    else this.message.displayMessage()
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

    waitFor(0, () => {
      this.emit(SLIDER_EVENTS.MOUNTED, {
        root: this.$root,
        options: this.userOptions
      })
    })
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
    this.emit(SLIDER_EVENTS.DESTROYED, {
      root: this.$root
    })
  }

  public use(plugin: BSPlugin): void {
    const pluginName = this.getPluginName(plugin)
    const isValidPlugin = this.isValidPluginType(plugin)

    if (!isValidPlugin) {
      this.message.displayInvalidPluginType()
      return
    }

    if (!this.isValidPluginName(pluginName)) {
      this.message.displayInvalidPluginName(pluginName)
      return
    }

    if (!this.isMatchingPluginRoot(plugin)) {
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

  private getPluginName(plugin: BSPlugin): string {
    return plugin.constructor?.name ?? "UnknownPlugin"
  }

  private isValidPluginType(plugin: unknown): plugin is BSPlugin {
    return plugin instanceof BSPlugin
  }

  private isValidPluginName(pluginName: string): boolean {
    return /^BS[A-Z][A-Za-z0-9]*Plugin$/.test(pluginName)
  }

  private isMatchingPluginRoot(plugin: BSPlugin): boolean {
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
