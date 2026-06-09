import { STORIES_DOCS } from "./constants"
import { Validation } from "./Validation"

export class Messages extends Validation {
  private readonly messageMap: Record<string, string>
  private readonly levelMap: Record<string, "warn" | "error">
  private readonly rootSelector: string

  constructor($root: string) {
    super($root)
    this.rootSelector = $root
    this.messageMap = Messages.textMessages($root)
    this.levelMap = Messages.textLevels()
  }

  private static textMessages($root: string): Record<string, string> {
    return {
      NO_ROOT: `Could not find root selector ${$root}.\nSee: ${STORIES_DOCS.MARKUP}`,
      NO_TRACK: `Could not find .bs-track inside ${$root}.\nSee: ${STORIES_DOCS.MARKUP}`,
      NO_CHILDREN: `Could not find .bs-container inside .bs-track for ${$root}.\nSee: ${STORIES_DOCS.MARKUP}`,
      NO_SLIDES: `Could not find any .bs-slide inside .bs-container for ${$root}.\nSee: ${STORIES_DOCS.MARKUP}`,
      DUPLICATE_ELEMENTS: `Found duplicated core slider elements in ${$root}.\nSee: ${STORIES_DOCS.MARKUP}`,
      INVALID_ORDER: `Found invalid core slider markup order in ${$root}.\nSee: ${STORIES_DOCS.MARKUP}`,
      DUPLICATE_STORIES_ELEMENTS: `Found duplicated unique stories elements in ${$root}.\nSee: ${STORIES_DOCS.MARKUP}`,
      INVALID_TRACK_CHILD_ORDER: `Found invalid stories track content order in ${$root}. .bs-container must come before stories-only elements inside .bs-track.\nSee: ${STORIES_DOCS.MARKUP}`,
      INVALID_PROGRESS_POSITION: `Found .bs-stories-progress in the wrong place for ${$root}. Place it inside .bs-track.\nSee: ${STORIES_DOCS.MARKUP}`,
      INVALID_PROGRESS_STRUCTURE: `Found incomplete .bs-stories-progress markup for ${$root}. Include both .bs-stories-progress-item and .bs-stories-progress-bar.\nSee: ${STORIES_DOCS.MARKUP}`,
      INVALID_PAUSE_POSITION: `Found .bs-stories-pause-indicator in the wrong place for ${$root}. Place it inside .bs-track.\nSee: ${STORIES_DOCS.MARKUP}`,
      INVALID_LAYER_POSITION: `Found .bs-stories-layer in the wrong place for ${$root}. Place it outside the slider root and outside .bs-track.\nSee: ${STORIES_DOCS.MARKUP}`,
      INVALID_BACKDROP_POSITION: `Found .bs-stories-backdrop in the wrong place for ${$root}. Place it inside .bs-stories-layer.\nSee: ${STORIES_DOCS.MARKUP}`,
      INVALID_CLOSE_POSITION: `Found invalid .bs-stories-close markup for ${$root}. Use a <button> inside .bs-stories-layer or inside .bs-track.\nSee: ${STORIES_DOCS.MARKUP}`,
      INVALID_MUTE_POSITION: `Found invalid .bs-stories-mute markup for ${$root}. Use a <button> inside .bs-stories-layer or inside .bs-track.\nSee: ${STORIES_DOCS.MARKUP}`,
      MULTIPLE_VIDEOS_IN_STORY: `Found more than one video in the same story for ${$root}. Only one video per story is supported.\nSee: ${STORIES_DOCS.MARKUP}`
    }
  }

  private static textLevels(): Record<string, "warn" | "error"> {
    return {
      NO_ROOT: "error",
      NO_TRACK: "error",
      NO_CHILDREN: "error",
      NO_SLIDES: "error",
      DUPLICATE_ELEMENTS: "error",
      INVALID_ORDER: "error",
      DUPLICATE_STORIES_ELEMENTS: "error",
      INVALID_TRACK_CHILD_ORDER: "error",
      INVALID_PROGRESS_POSITION: "error",
      INVALID_PROGRESS_STRUCTURE: "error",
      INVALID_PAUSE_POSITION: "error",
      INVALID_LAYER_POSITION: "error",
      INVALID_BACKDROP_POSITION: "error",
      INVALID_CLOSE_POSITION: "error",
      INVALID_MUTE_POSITION: "error",
      MULTIPLE_VIDEOS_IN_STORY: "warn"
    }
  }

  public displayMessage(): void {
    this.runValidations()

    this.getIds().forEach(id => {
      const message = this.getMessageById(id)
      const level = this.levelMap[id] ?? "error"

      console[level](message)
    })
  }

  private getMessageById(id: string): string {
    if (id === "DUPLICATE_STORIES_ELEMENTS") {
      const duplicateElements = this.getDetails(id)

      if (duplicateElements.length > 0) {
        return (
          `Found duplicated unique stories elements in ${this.rootSelector}: ` +
          `${duplicateElements.map(className => `.${className}`).join(", ")}.\n` +
          `See: ${STORIES_DOCS.MARKUP}`
        )
      }
    }

    if (id === "MULTIPLE_VIDEOS_IN_STORY") {
      const storyIndexes = this.getDetails(id)

      if (storyIndexes.length > 0) {
        return (
          `Found more than one video in the following stories for ${this.rootSelector}: ` +
          `${storyIndexes.map(index => `#${index}`).join(", ")}. Only one video per story is supported.\n` +
          `See: ${STORIES_DOCS.MARKUP}`
        )
      }
    }

    return this.messageMap[id]
  }
}
