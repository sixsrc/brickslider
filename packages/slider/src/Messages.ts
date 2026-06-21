import { BASIC_DOCS, ERROR_IDS, START_DOCS } from "./helpers"
import { Validation } from "./Validation"
import type { MessageLevel } from "./types"

export class Messages extends Validation {
  private readonly rootSelector: string

  constructor($root: string) {
    super($root)
    this.rootSelector = $root
  }

  public displayMessage(
    options?: Parameters<Validation["sanitizeOptions"]>[0]
  ): void {
    this.runValidations(options)

    this.getIds().forEach(id => {
      const level: MessageLevel = ERROR_IDS.has(id) ? "error" : "warn"
      console[level](this.getMessageById(id))
    })
  }

  public displayWarning(message: string): void {
    console.warn(message)
  }

  public displayError(message: string): void {
    console.error(message)
  }

  public displayInvalidGoToIndex(index: number): void {
    this.displayWarning(
      `[BrickSlider] goTo(index) expects a finite number. Received: ${String(index)}.`
    )
  }

  public displayDragFreeGoToIgnored(): void {
    this.displayWarning(
      `[BrickSlider] goTo(index) is ignored when useDragFree is enabled.`
    )
  }

  public displayInvalidPluginType(): void {
    this.displayError(
      `[BrickSlider] Plugin rejected. Invalid plugin contract.\n${START_DOCS}`
    )
  }

  public displayPluginRootMismatch(pluginName: string): void {
    this.displayError(
      `[BrickSlider] Plugin rejected. "${pluginName}" must use the same root selector.`
    )
  }

  private getMessageById(id: string): string {
    if (id === "DUPLICATE_ELEMENTS") {
      const duplicates = this.getDetails(id)

      if (duplicates.length) {
        return `Found duplicated core elements in ${this.rootSelector}: ${duplicates
          .map(className => `.${className}`)
          .join(", ")}.\n${BASIC_DOCS}`
      }
    }

    if (id === "INVALID_ORDER") {
      const details = this.getDetails(id)

      if (details.length) {
        return `Found invalid core slider markup in ${this.rootSelector}.\n${details.join("\n")}\n${BASIC_DOCS}`
      }
    }

    if (id === "RESPONSIVE_BREAKPOINTS_MISSING_IN_SCREENS") {
      const breakpoints = this.getDetails(id)

      if (breakpoints.length) {
        return `responsive in ${this.rootSelector} uses breakpoints missing in screens: ${breakpoints
          .map(breakpoint => breakpoint.toUpperCase())
          .join(", ")}.\n${BASIC_DOCS}`
      }
    }

    switch (id) {
      case "NO_ROOT":
        return `Could not find root selector ${this.rootSelector}.\n${START_DOCS}`
      case "NO_TRACK":
        return `Could not find .bs-track in ${this.rootSelector}.\n${BASIC_DOCS}`
      case "NO_CHILDREN":
        return `Could not find .bs-container in ${this.rootSelector}.\n${BASIC_DOCS}`
      case "NO_SLIDES":
        return `Could not find .bs-slide in ${this.rootSelector}.\n${BASIC_DOCS}`
      case "INVALID_SLIDE_SIZES_VALUES":
        return `slideSizes in ${this.rootSelector} is invalid and will be ignored. Use only non-negative numbers.\n${BASIC_DOCS}`
      case "UNSUPPORTED_SLIDE_SIZES_SINGLE_VIEW":
        return `slideSizes in ${this.rootSelector} is ignored when slidesPerView is 1.\n${BASIC_DOCS}`
      case "RESPONSIVE_WITHOUT_SCREENS":
        return `responsive in ${this.rootSelector} is ignored because screens is missing.\n${BASIC_DOCS}`
      case "INVALID_SCREENS_BREAKPOINT_KEYS":
        return `screens in ${this.rootSelector} contains unsupported breakpoint names.\n${BASIC_DOCS}`
      case "INVALID_RESPONSIVE_BREAKPOINT_KEYS":
        return `responsive in ${this.rootSelector} contains unsupported breakpoint names.\n${BASIC_DOCS}`
      case "DRAG_FREE_WITH_DOTS":
        return `dots in ${this.rootSelector} is ignored when useDragFree is enabled.\n${BASIC_DOCS}`
      default:
        return `BrickSlider validation warning in ${this.rootSelector}.\n${BASIC_DOCS}`
    }
  }
}
