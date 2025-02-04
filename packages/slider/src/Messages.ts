import { DOCS } from "./constants"
import { Validation } from "./Validation"

export class Messages extends Validation {
  private messageMap: Record<string, string>

  constructor($root: string) {
    super($root)
    this.messageMap = Messages.TextMessages($root)
  }

  static TextMessages($root: string) {
    return {
      NO_ROOT: `Root selector ${$root} is invalid or not found.\nSee: ${DOCS.GET_STARTED}`,
      NO_TRACK: `Track container for ${$root} is invalid or not found.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      NO_CHILDREN: `Children for ${$root} container is invalid or not found.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      NO_SLIDES: `The slides for ${$root} are missing or invalid.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      DUPLICATE_ELEMENTS: `Duplicate elements for ${$root} detected in the DOM.\nSee: ${DOCS.BASIC_HTML_DOC}`,
      INVALID_ORDER: `Elements for ${$root} are not in the expected order.\nSee: ${DOCS.BASIC_HTML_DOC}`
    }
  }

  public displayMessage(): void {
    this.runValidations()

    this.getIds().forEach(id => {
      const message = this.messageMap[id]
      console.error(message)
    })
  }
}
