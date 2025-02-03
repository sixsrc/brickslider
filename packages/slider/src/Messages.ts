import { DOCS } from "./constants"
import { isValidSelector } from "./helpers"
import { Validation } from "./Validation"

export class Messages extends Validation {
  constructor($root: string) {
    super($root)
    this.$root = $root
  }

  private invalidSelector(): { type: string; message: string } {
    return {
      type: "error",
      message: `Root Selector invalid.\nSee: ${DOCS.GET_STARTED}`
    }
  }

  private rootNotExists(): { type: string; message: string } {
    return {
      type: "error",
      message: `Root Selector for ${this.$root} not exists.\nSee: ${DOCS.BASIC_HTML_DOC}`
    }
  }

  private trackNotExists(): { type: string; message: string } {
    return {
      type: "error",
      message: `Track Selector for ${this.$root} not exists.\nSee: ${DOCS.BASIC_HTML_DOC}`
    }
  }

  private childrenNotExists(): { type: string; message: string } {
    return {
      type: "error",
      message: `Children Selector for ${this.$root} not exists.\nSee: ${DOCS.BASIC_HTML_DOC}`
    }
  }

  private slideNotExists(): { type: string; message: string } {
    return {
      type: "warn",
      message: `Slides for ${this.$root} is not present. \nSee: ${DOCS.BASIC_HTML_DOC}`
    }
  }

  private invalidElementsHierarchyOrder() {
    return {
      type: "error",
      message: `Invalid elements hierarchy order.\nSee: ${DOCS.BASIC_HTML_DOC}`
    }
  }

  private invalidElementsDuplication(): { type: string; message: string } {
    return {
      type: "error",
      message: `Invalid duplication of element hierarchy.\nSee: ${DOCS.BASIC_HTML_DOC}`
    }
  }

  private validations() {
    return [
      {
        c: () => !isValidSelector(this.$root),
        m: this.invalidSelector().message
      },
      {
        c: () => !this.hasRootContainer(),
        m: this.rootNotExists().message,
        t: "error"
      },
      {
        c: () => !this.hasChildrenContainer(),
        m: this.childrenNotExists().message,
        t: "error"
      },
      {
        c: () => !this.hasTrackContainer(),
        m: this.trackNotExists().message,
        t: "error"
      },

      {
        c: () => this.hasDuplicateElements(),
        m: this.invalidElementsDuplication().message,
        t: "error"
      },
      {
        c: () => this.hasAllElementsInOrder(),
        m: this.invalidElementsHierarchyOrder().message,
        t: "error"
      },
      {
        c: () => !this.hasSlide(),
        m: this.slideNotExists().message,
        t: "warn"
      }
    ]
  }

  private defineMessage(): { message: string; type: string } | undefined {
    for (const { c, m, t } of this.validations()) {
      if (c()) {
        return { message: m, type: t as string }
      }
    }
  }

  public setMessage(): void {
    const { message, type } = this.defineMessage() || ({} as any)

    type === "error" ? console.error(message) : console.warn(message)
  }
}
