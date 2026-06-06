import { BaseSlider } from "./BaseSlider"
import { ATTRIBUTES, DOM_ELEMENT_ALIASES, EVENTS, TAGS } from "./helpers"
import {
  addClass,
  appendToParent,
  createNewElement,
  getProgressContainer
} from "./helpers"

export class Progress extends BaseSlider {
  private containerProgress: HTMLElement | undefined
  private progressBar: HTMLElement | undefined

  constructor($root: string) {
    super($root)
    this.containerProgress = getProgressContainer($root)
    this.progressBar = this.getExistingProgressBar()
  }

  public init(): void {
    if (!this.containerProgress) return

    this.progressBar = this.ensureProgressBar()
    this.sync()
  }

  public sync(): void {
    const { currentEventType } = this.store
    const progressBar = this.progressBar ?? this.ensureProgressBar()
    const containerProgress = this.containerProgress

    if (!progressBar || !containerProgress) return

    const progressValue = this.getProgressValue()
    const isTouchMove = currentEventType === EVENTS.TOUCHMOVE
    const currentValue = this.getCurrentProgressValue(containerProgress)
    const currentScale = currentValue / 100
    const nextScale = progressValue / 100
    const duration = isTouchMove ? 0 : 500
    const progressNow = Math.round(progressValue)

    this.animate(
      progressBar,
      [
        { transform: `scaleX(${currentScale})` },
        { transform: `scaleX(${nextScale})` }
      ],
      this.options(duration)
    )
    containerProgress.setAttribute(ATTRIBUTES.ARIA_VALUE_NOW, `${progressNow}`)
  }

  private ensureProgressBar(): HTMLElement | undefined {
    if (!this.containerProgress) return

    const existingProgressBar = this.getExistingProgressBar()

    if (existingProgressBar) return existingProgressBar

    const progressBar = createNewElement(TAGS.DIV)

    addClass([progressBar], DOM_ELEMENT_ALIASES.PROGRESS_BAR[0])
    appendToParent(this.containerProgress, progressBar)

    return progressBar
  }

  private getExistingProgressBar(): HTMLElement | undefined {
    return this.containerProgress?.querySelector(
      `.${DOM_ELEMENT_ALIASES.PROGRESS_BAR[0]}`
    ) as HTMLElement | undefined
  }

  private getProgressValue(): number {
    const { useDragFree } = this.store

    if (useDragFree) return this.getDragFreeProgressValue()

    return this.getPagedProgressValue()
  }

  private getPagedProgressValue(): number {
    const { activePage, numberOfPages } = this.store
    const safePages = Math.max(1, numberOfPages || 0)
    const safePage = Math.max(0, Math.min(activePage || 0, safePages - 1))

    return (100 * (safePage + 1)) / safePages
  }

  private getDragFreeProgressValue(): number {
    const currentTranslate = Math.abs(this.store.currentTranslate ?? 0)
    const maxTranslate = Math.max(
      0,
      this.getTotalWidth() - (this.store.sliderWidth ?? this.sliderWidth ?? 0)
    )

    if (maxTranslate <= 0) return 100

    return Math.max(0, Math.min((currentTranslate / maxTranslate) * 100, 100))
  }

  private getCurrentProgressValue(containerProgress: HTMLElement): number {
    const currentValue = Number(
      containerProgress.getAttribute(ATTRIBUTES.ARIA_VALUE_NOW) ?? 0
    )

    if (!Number.isFinite(currentValue)) return 0

    return Math.max(0, Math.min(currentValue, 100))
  }
}
