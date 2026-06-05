import { DOCS } from "./helpers"
import { Validation } from "./Validation"

export class Messages extends Validation {
  private messageMap: Record<string, string>
  private levelMap: Record<string, "warn" | "error">

  constructor($root: string) {
    super($root)
    this.messageMap = Messages.TextMessages($root)
    this.levelMap = Messages.TextLevels()
  }

  static TextMessages($root: string) {
    return {
      NO_ROOT: `Root selector ${$root} is invalid or not found.\nSee: ${DOCS.GET_STARTED}`,
      NO_TRACK: `Track container for ${$root} is invalid or not found.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      NO_CHILDREN: `Children for ${$root} container is invalid or not found.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      NO_SLIDES: `The slides for ${$root} are missing or invalid.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      DUPLICATE_ELEMENTS: `Duplicate elements for ${$root} detected in the DOM.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      INVALID_ORDER: `Elements for ${$root} are not in the expected order.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      INVALID_SLIDE_SIZES_VALUES: `slideSizes for ${$root} is invalid and will be ignored. Use only non-negative numbers. String values such as "30px", "50%" or "2rem" are not supported.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      UNSUPPORTED_SLIDE_SIZES_SINGLE_VIEW: `slideSizes for ${$root} will be ignored because this option is not supported when slidesPerView is 1. To use slideSizes, set slidesPerView to 2 or greater.\nSee: ${DOCS.BASIC_HTML_DOC}`
    }
  }

  static TextLevels() {
    return {
      NO_ROOT: "error",
      NO_TRACK: "error",
      NO_CHILDREN: "error",
      NO_SLIDES: "error",
      DUPLICATE_ELEMENTS: "error",
      INVALID_ORDER: "error",
      INVALID_SLIDE_SIZES_VALUES: "warn",
      UNSUPPORTED_SLIDE_SIZES_SINGLE_VIEW: "warn"
    } as const
  }

  public displayMessage(options?: Parameters<Validation["sanitizeOptions"]>[0]): void {
    this.runValidations(options)

    this.getIds().forEach(id => {
      const message = this.messageMap[id]
      const level = this.levelMap[id] ?? "error"
      console[level](message)
    })
  }
}
