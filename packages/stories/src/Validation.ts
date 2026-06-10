import {
  Validation as SliderValidation,
  containsElement,
  DOM_ELEMENT_ALIASES,
  getChildren,
  TAGS,
  getAllElements,
  getElement,
  getRootSelector,
  hasClass
} from "@sixsrc/brick-slider/plugin-api"
import { STORIES_CLASSES } from "./constants"
import type { BrickSliderStoriesValidationId } from "./types"

export class Validation {
  private readonly $root: string
  private readonly sliderValidation: SliderValidation
  private ids = new Set<string>()
  private details: Record<string, string[]> = {}

  constructor($root: string) {
    this.$root = $root
    this.sliderValidation = new SliderValidation($root)
  }

  public isValid(): boolean {
    this.runValidations()

    return !this.getIds().some(id => this.getLevel(id) === "error")
  }

  public runValidations(): void {
    const validations: Array<{
      id: BrickSliderStoriesValidationId
      condition: () => boolean
    }> = [
      {
        id: "DUPLICATE_STORIES_ELEMENTS",
        condition: () => this.hasDuplicateStoriesElements()
      },
      {
        id: "INVALID_TRACK_CHILD_ORDER",
        condition: () => this.hasInvalidTrackChildOrder()
      },
      {
        id: "INVALID_PROGRESS_POSITION",
        condition: () => this.hasInvalidProgressPosition()
      },
      {
        id: "INVALID_PROGRESS_STRUCTURE",
        condition: () => this.hasInvalidProgressStructure()
      },
      {
        id: "INVALID_PAUSE_POSITION",
        condition: () => this.hasInvalidPausePosition()
      },
      {
        id: "INVALID_LAYER_POSITION",
        condition: () => this.hasInvalidLayerPosition()
      },
      {
        id: "INVALID_BACKDROP_POSITION",
        condition: () => this.hasInvalidBackdropPosition()
      },
      {
        id: "INVALID_CLOSE_POSITION",
        condition: () => this.hasInvalidClosePosition()
      },
      {
        id: "INVALID_MUTE_POSITION",
        condition: () => this.hasInvalidMutePosition()
      },
      {
        id: "MULTIPLE_VIDEOS_IN_STORY",
        condition: () => this.hasMultipleVideosInSingleStory()
      }
    ]

    this.sliderValidation.runValidations()
    this.ids = new Set(this.sliderValidation.getIds())
    this.details = {}

    validations.forEach(({ id, condition }) => {
      if (condition()) this.ids.add(id)
    })
  }

  public getIds(): string[] {
    return Array.from(this.ids)
  }

  public getDetails(id: string): string[] {
    if (id === "MULTIPLE_VIDEOS_IN_STORY") {
      return this.getStoriesWithMultipleVideos()
    }

    return this.details[id] ?? this.sliderValidation.getDetails(id)
  }

  public getLevel(id: string): "warn" | "error" {
    return id === "MULTIPLE_VIDEOS_IN_STORY" ? "warn" : "error"
  }

  private getRoot(): HTMLElement | undefined {
    return getRootSelector(this.$root)
  }

  private getTrack(): HTMLElement | undefined {
    return getElement<HTMLElement>(
      `.${DOM_ELEMENT_ALIASES.TRACK[0]}`,
      this.getRoot()
    )
  }

  private getChildren(): HTMLElement | undefined {
    return getChildren(this.$root)
  }

  private getLayer(): HTMLElement | undefined {
    return this.getStoriesLayers()[0]
  }

  private getProgress(): HTMLElement | undefined {
    return this.getScopedStoryElements(STORIES_CLASSES.PROGRESS)[0]
  }

  private getPauseIndicator(): HTMLElement | undefined {
    return this.getScopedStoryElements(STORIES_CLASSES.PAUSE_INDICATOR)[0]
  }

  private getBackdrop(): HTMLElement | undefined {
    return this.getOwnedStoryElements(STORIES_CLASSES.BACKDROP)[0]
  }

  private getClose(): HTMLElement | undefined {
    return this.getOwnedStoryElements(STORIES_CLASSES.CLOSE)[0]
  }

  private getMute(): HTMLElement | undefined {
    return this.getOwnedStoryElements(STORIES_CLASSES.MUTE)[0]
  }

  private getScopedStoryElements(className: string): HTMLElement[] {
    const root = this.getRoot()

    if (!root) return []

    return Array.from(getAllElements<HTMLElement>(`.${className}`, root))
  }

  private getOwnedStoryElements(className: string): HTMLElement[] {
    const rootElements = this.getScopedStoryElements(className)
    const layerElements = this.getStoriesLayers().flatMap(layer => {
      return Array.from(getAllElements<HTMLElement>(`.${className}`, layer))
    })

    return [...new Set([...rootElements, ...layerElements])]
  }

  private getExternalLayer(): HTMLElement | undefined {
    const root = this.getRoot()
    const nextElement = root?.nextElementSibling

    if (!nextElement) return
    if (!(nextElement instanceof HTMLElement)) return
    if (!hasClass(nextElement, STORIES_CLASSES.LAYER)) return

    return nextElement as HTMLElement
  }

  private getStoriesLayers(): HTMLElement[] {
    const rootLayers = this.getScopedStoryElements(STORIES_CLASSES.LAYER)
    const externalLayer = this.getExternalLayer()

    if (!externalLayer) return rootLayers
    if (rootLayers.includes(externalLayer)) return rootLayers

    return [...rootLayers, externalLayer]
  }

  private hasDuplicateStoriesElements(): boolean {
    const duplicateClassNames = this.getDuplicateStoriesClassNames()

    if (duplicateClassNames.length === 0) return false

    this.details.DUPLICATE_STORIES_ELEMENTS = duplicateClassNames
    return true
  }

  private getDuplicateStoriesClassNames(): string[] {
    const uniqueClassNames = [
      STORIES_CLASSES.LAYER,
      STORIES_CLASSES.PROGRESS,
      STORIES_CLASSES.PAUSE_INDICATOR,
      STORIES_CLASSES.BACKDROP,
      STORIES_CLASSES.CLOSE,
      STORIES_CLASSES.MUTE
    ]

    return uniqueClassNames.filter(className => {
      if (className === STORIES_CLASSES.LAYER) {
        return this.getStoriesLayers().length > 1
      }

      return this.getOwnedStoryElements(className).length > 1
    })
  }

  private hasInvalidTrackChildOrder(): boolean {
    const track = this.getTrack()
    const children = this.getChildren()

    if (!track || !children) return false

    return track.firstElementChild !== children
  }

  private hasInvalidProgressPosition(): boolean {
    const progress = this.getProgress()
    const track = this.getTrack()

    if (!progress) return false
    if (!track) return true

    return !containsElement(track, progress)
  }

  private hasInvalidProgressStructure(): boolean {
    const progress = this.getProgress()

    if (!progress) return false

    const progressItem = getElement<HTMLElement>(
      `.${STORIES_CLASSES.PROGRESS_ITEM}`,
      progress
    )
    const progressBar = getElement<HTMLElement>(
      `.${STORIES_CLASSES.PROGRESS_BAR}`,
      progress
    )

    return !progressItem || !progressBar
  }

  private hasInvalidPausePosition(): boolean {
    const pauseIndicator = this.getPauseIndicator()
    const track = this.getTrack()

    if (!pauseIndicator) return false
    if (!track) return true

    return pauseIndicator.parentElement !== track
  }

  private hasInvalidLayerPosition(): boolean {
    const layer = this.getLayer()
    const root = this.getRoot()
    const track = this.getTrack()

    if (!layer) return false
    if (!root) return true

    const isInsideRoot = containsElement(root, layer)
    const isInsideTrack = containsElement(track, layer)

    return isInsideRoot || isInsideTrack
  }

  private hasInvalidBackdropPosition(): boolean {
    const backdrop = this.getBackdrop()
    const layer = this.getLayer()

    if (!backdrop) return false
    if (!layer) return true

    return !containsElement(layer, backdrop)
  }

  private hasInvalidClosePosition(): boolean {
    const close = this.getClose()
    const layer = this.getLayer()
    const track = this.getTrack()

    if (!close) return false
    if (!layer && !track) return true

    const isInsideLayer = containsElement(layer, close)
    const isInsideTrack = containsElement(track, close)

    return (
      (!isInsideLayer && !isInsideTrack) ||
      close.tagName.toLowerCase() !== TAGS.BUTTON
    )
  }

  private hasInvalidMutePosition(): boolean {
    const mute = this.getMute()
    const layer = this.getLayer()
    const track = this.getTrack()

    if (!mute) return false
    if (!layer && !track) return true

    const isInsideLayer = containsElement(layer, mute)
    const isInsideTrack = containsElement(track, mute)

    return (
      (!isInsideLayer && !isInsideTrack) ||
      mute.tagName.toLowerCase() !== TAGS.BUTTON
    )
  }

  private hasMultipleVideosInSingleStory(): boolean {
    return this.getStoriesWithMultipleVideos().length > 0
  }

  private getStoriesWithMultipleVideos(): string[] {
    const children = this.getChildren()

    if (!children) return []

    const slides = Array.from(
      getAllElements<HTMLElement>(
        `:scope > .${DOM_ELEMENT_ALIASES.SLIDE[0]}`,
        children
      )
    )

    return slides.reduce<string[]>((acc, slide, index) => {
      const videos = getAllElements<HTMLVideoElement>(TAGS.VIDEO, slide)

      if (videos.length > 1) acc.push(String(index + 1))

      return acc
    }, [])
  }
}
