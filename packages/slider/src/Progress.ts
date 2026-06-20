import { BaseSlider } from "./BaseSlider"
import {
  ATTRIBUTES,
  DOM_ELEMENT_ALIASES,
  EVENTS,
  TAGS,
  TIMES
} from "./helpers"
import {
  addClass,
  appendToParent,
  createNewElement,
  getAttribute,
  getProgressContainer,
  setAttribute
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
    const progressBar = this.progressBar ?? this.ensureProgressBar()
    const containerProgress = this.containerProgress

    if (!progressBar || !containerProgress) return

    this.updateProgress(progressBar, containerProgress)
  }

  private updateProgress(
    progressBar: HTMLElement,
    containerProgress: HTMLElement
  ): void {
    const progressAnimation = this.getProgressAnimation(progressBar)
    const { progressKeyFrames, duration, progressNow } = progressAnimation

    this.stopProgressAnimations(progressBar)
    this.animate(progressBar, progressKeyFrames, this.options(duration))
    this.setProgressNow(containerProgress, progressNow)
    this.setProgressSyncedAt(progressBar)
  }

  private stopProgressAnimations(progressBar: HTMLElement): void {
    progressBar.getAnimations().forEach(animation => animation.cancel())
  }

  private getProgressAnimation(progressBar: HTMLElement): {
    progressKeyFrames: Keyframe[]
    duration: number
    progressNow: number
  } {
    const { currentEventType, isFastNavigation } = this.store
    const progressValue = this.getProgressValue()
    const elapsedSinceLastSync = this.getElapsedSinceLastSync(progressBar)
    const isTouchProgress =
      currentEventType === EVENTS.TOUCHMOVE ||
      currentEventType === EVENTS.TOUCHEND
    const isInstantProgress = isTouchProgress || isFastNavigation
    const currentScale = this.getCurrentProgressScale(progressBar)
    const nextScale = progressValue / 100
    const duration = isInstantProgress
      ? 0
      : this.getResponsiveProgressDuration(elapsedSinceLastSync)
    const progressNow = Math.round(progressValue)
    const progressKeyFrames = this.getProgressKeyFrames(currentScale, nextScale)

    return {
      progressKeyFrames,
      duration,
      progressNow
    }
  }


  private getResponsiveProgressDuration(
    elapsedSinceLastSync: number | null
  ): number {
    const minimumResponsiveDuration = 90

    if (elapsedSinceLastSync === null) return TIMES.PROGRESS_TRANSITION_TIME
    if (elapsedSinceLastSync <= 32) return minimumResponsiveDuration

    return Math.max(
      minimumResponsiveDuration,
      Math.min(TIMES.PROGRESS_TRANSITION_TIME, elapsedSinceLastSync)
    )
  }

  private getElapsedSinceLastSync(progressBar: HTMLElement): number | null {
    const syncedAt = getAttribute(progressBar, ATTRIBUTES.DATA_PROGRESS_SYNCED_AT)
    const syncedAtNumber = Number(syncedAt)

    if (!syncedAt || !Number.isFinite(syncedAtNumber)) return null

    return Math.max(0, Date.now() - syncedAtNumber)
  }

  private setProgressSyncedAt(progressBar: HTMLElement): void {
    setAttribute(
      progressBar,
      ATTRIBUTES.DATA_PROGRESS_SYNCED_AT,
      String(Date.now())
    )
  }

  private getProgressKeyFrames(
    currentScale: number,
    nextScale: number
  ): Keyframe[] {
    return [
      { scale: `${currentScale} 1` },
      { scale: `${nextScale} 1` }
    ]
  }

  private setProgressNow(
    containerProgress: HTMLElement,
    progressNow: number
  ): void {
    containerProgress.setAttribute(ATTRIBUTES.ARIA_VALUE_NOW, `${progressNow}`)
  }

  private ensureProgressBar(): HTMLElement | undefined {
    const containerProgress = this.containerProgress
    const existingProgressBar = this.getExistingProgressBar()
    const progressBar = this.createProgressBar()

    if (!containerProgress) return
    if (existingProgressBar) return existingProgressBar

    this.mountProgressBar(containerProgress, progressBar)

    return progressBar
  }

  private createProgressBar(): HTMLElement {
    return createNewElement(TAGS.DIV)
  }

  private mountProgressBar(
    containerProgress: HTMLElement,
    progressBar: HTMLElement
  ): void {
    addClass([progressBar], DOM_ELEMENT_ALIASES.PROGRESS_BAR[0])
    appendToParent(containerProgress, progressBar)
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

    if (safePages === 1) return 100

    return (100 * safePage) / (safePages - 1)
  }

  private getDragFreeProgressValue(): number {
    const {
      currentTranslate: storedCurrentTranslate,
      sliderWidth: storedSliderWidth
    } = this.store
    const currentTranslate = Math.abs(storedCurrentTranslate ?? 0)
    const maxTranslate = Math.max(
      0,
      this.getTotalWidth() - (storedSliderWidth ?? this.sliderWidth ?? 0)
    )

    if (maxTranslate <= 0) return 100

    return Math.max(0, Math.min((currentTranslate / maxTranslate) * 100, 100))
  }

  private getCurrentProgressScale(progressBar: HTMLElement): number {
    const computedStyle = window.getComputedStyle(progressBar)
    const scaleFromProperty = this.getScaleFromProperty(computedStyle.scale)
    const scaleFromTransform = this.getScaleFromTransform(
      computedStyle.transform
    )

    if (scaleFromProperty !== null) return scaleFromProperty

    return scaleFromTransform
  }

  private getScaleFromProperty(computedScale: string): number | null {
    if (!computedScale || computedScale === "none") return null

    return this.getScaleFromComputedScale(computedScale)
  }

  private getScaleFromTransform(computedTransform: string): number {
    const matrix3dScale = this.getScaleFromMatrix(computedTransform, "matrix3d")
    const matrixScale = this.getScaleFromMatrix(computedTransform, "matrix")

    if (!computedTransform || computedTransform === "none") return 0
    if (matrix3dScale !== null) return matrix3dScale
    if (matrixScale !== null) return matrixScale

    return 0
  }

  private getScaleFromMatrix(
    computedTransform: string,
    matrixType: "matrix" | "matrix3d"
  ): number | null {
    const matrixMatch = computedTransform.match(
      new RegExp(`${matrixType}\\(([^)]+)\\)`)
    )

    if (!matrixMatch) return null

    return this.getScaleFromMatrixValue(matrixMatch[1])
  }

  private getScaleFromMatrixValue(matrixValue: string): number {
    const values = matrixValue.split(",").map(value => Number(value.trim()))
    const scaleX = values[0] ?? 0

    return this.clampProgressScale(scaleX)
  }

  private getScaleFromComputedScale(computedScale: string): number {
    const [scaleXValue] = computedScale.split(" ")
    const scaleX = Number(scaleXValue)

    return this.clampProgressScale(scaleX)
  }

  private clampProgressScale(scale: number): number {
    if (!Number.isFinite(scale)) return 0

    return Math.max(0, Math.min(scale, 1))
  }
}
