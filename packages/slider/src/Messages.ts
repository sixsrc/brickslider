import { DOCS } from "./helpers"
import { Validation } from "./Validation"

export class Messages extends Validation {
  private messageMap: Record<string, string>
  private levelMap: Record<string, "warn" | "error">
  private rootSelector: string

  constructor($root: string) {
    super($root)
    this.rootSelector = $root
    this.messageMap = Messages.TextMessages($root)
    this.levelMap = Messages.TextLevels()
  }

  static TextMessages($root: string): Record<string, string> {
    return {
      NO_ROOT: `Could not find root selector ${$root}.\nSee: ${DOCS.GET_STARTED}`,
      NO_TRACK: `Could not find .bs-track inside ${$root}.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      NO_CHILDREN: `Could not find .bs-container inside .bs-track for ${$root}.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      NO_SLIDES: `Could not find any .bs-slide inside .bs-container for ${$root}.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      DUPLICATE_ELEMENTS: `Found duplicated core slider elements in ${$root}.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      INVALID_ORDER: `Found invalid core slider markup order in ${$root}.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      INVALID_SLIDE_SIZES_VALUES: `slideSizes for ${$root} is invalid and will be ignored. Use only non-negative numbers. String values such as "30px", "50%" or "2rem" are not supported.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      UNSUPPORTED_SLIDE_SIZES_SINGLE_VIEW: `slideSizes for ${$root} will be ignored because this option is not supported when slidesPerView is 1. To use slideSizes, set slidesPerView to 2 or greater.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      RESPONSIVE_WITHOUT_SCREENS: `responsive for ${$root} will be ignored because no screens object was provided. Define screens with the breakpoint widths before using responsive.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      INVALID_SCREENS_BREAKPOINT_KEYS: `screens for ${$root} contains unsupported breakpoint names. Use only xs, sm, md, lg, xl or 2xl. Invalid keys will be ignored.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      INVALID_RESPONSIVE_BREAKPOINT_KEYS: `responsive for ${$root} contains unsupported breakpoint names. Use only xs, sm, md, lg, xl or 2xl. Invalid keys will be ignored.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      RESPONSIVE_BREAKPOINTS_MISSING_IN_SCREENS: `responsive for ${$root} contains breakpoints that are missing or invalid in screens. Define the same breakpoint with a numeric value in screens before using it in responsive.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      DRAG_FREE_WITH_DOTS: `dots for ${$root} will be ignored because useDragFree is enabled. Drag free mode does not support pagination dots.\nSee: ${DOCS.BASIC_HTML_DOC}`
    }
  }

  static TextLevels(): Record<string, "warn" | "error"> {
    return {
      NO_ROOT: "error",
      NO_TRACK: "error",
      NO_CHILDREN: "error",
      NO_SLIDES: "error",
      DUPLICATE_ELEMENTS: "error",
      INVALID_ORDER: "error",
      INVALID_SLIDE_SIZES_VALUES: "warn",
      UNSUPPORTED_SLIDE_SIZES_SINGLE_VIEW: "warn",
      RESPONSIVE_WITHOUT_SCREENS: "warn",
      INVALID_SCREENS_BREAKPOINT_KEYS: "warn",
      INVALID_RESPONSIVE_BREAKPOINT_KEYS: "warn",
      RESPONSIVE_BREAKPOINTS_MISSING_IN_SCREENS: "warn",
      DRAG_FREE_WITH_DOTS: "warn"
    } as const
  }

  public displayMessage(
    options?: Parameters<Validation["sanitizeOptions"]>[0]
  ): void {
    this.runValidations(options)

    this.getIds().forEach(id => {
      const message = this.getMessageById(id)
      const level = this.levelMap[id] ?? "error"
      console[level](message)
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
      `[BrickSlider] goTo(index) expects a finite number. Received: ${String(index)}. Ignoring call.`
    )
  }

  public displayDragFreeGoToIgnored(): void {
    this.displayWarning(
      `[BrickSlider] goTo(index) is ignored when useDragFree is enabled. Drag free mode does not support paginated navigation.`
    )
  }

  public displayInvalidPluginType(): void {
    this.displayError(
      `[BrickSlider] Plugin rejected. Official plugins must extend Plugin.`
    )
  }

  public displayPluginRootMismatch(pluginName: string): void {
    this.displayError(
      `[BrickSlider] Plugin rejected. "${pluginName}" must use the same root selector as the current slider instance.`
    )
  }

  private getMessageById(id: string): string {
    if (id === "DUPLICATE_ELEMENTS") {
      const duplicateElements = this.getDetails(id)

      if (duplicateElements.length > 0) {
        return (
          `Found duplicated core slider elements in ${this.rootSelector}: ` +
          `${duplicateElements.map(className => `.${className}`).join(", ")}.\n` +
          `See: ${DOCS.BASIC_HTML_DOC}`
        )
      }
    }

    if (id === "INVALID_ORDER") {
      const orderDetails = this.getDetails(id)

      if (orderDetails.length > 0) {
        return (
          `Found invalid core slider markup order in ${this.rootSelector}.\n` +
          `${orderDetails.join("\n")}\n` +
          `See: ${DOCS.BASIC_HTML_DOC}`
        )
      }
    }

    if (id === "RESPONSIVE_BREAKPOINTS_MISSING_IN_SCREENS") {
      const breakpoints = this.getDetails(id)

      if (breakpoints.length > 0) {
        const highlightedBreakpoints = breakpoints
          .map(breakpoint => `[${breakpoint.toUpperCase()}]`)
          .join(", ")

        return (
          `responsive for ${this.rootSelector} contains breakpoints without prior screen configuration: ` +
          `${highlightedBreakpoints}. Define the same breakpoint with a numeric value in screens before using it in responsive.\n` +
          `See: ${DOCS.BASIC_HTML_DOC}`
        )
      }
    }

    return this.messageMap[id]
  }
}
