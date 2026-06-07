import { BSPlugin } from "../../slider/src/BSPlugin"
import {
  ANIMATION_OPTIONS,
  ATTRIBUTES,
  EVENTS,
  SLIDER_EVENTS,
  TAGS,
  $,
  addClass,
  appendToParent,
  createNewElement,
  getAllElements,
  getSliderNodeList,
  removeClass,
  removeElement,
  setAttribute
} from "../../slider/src/helpers"
import {
  STORIES_CLASSES,
  STORIES_DEFAULTS,
  STORIES_STYLE_ID
} from "./constants"
import type {
  BSStoriesPluginOptions,
  ResolvedBSStoriesPluginOptions,
  StoriesTriggerInput,
  StoryTimerState
} from "./types"

type StorySlideChangePayload = {
  slideIndex?: number
  activePage?: number
}

export class BSStoriesPlugin extends BSPlugin {
  private activeAnimation: Animation | null = null
  private closeButton: HTMLElement | null = null
  private isOpen = false
  private isPaused = false
  private muteButton: HTMLElement | null = null
  private progressBars: HTMLElement[] = []
  private progressContainer: HTMLElement | null = null
  private readonly pluginOptions: ResolvedBSStoriesPluginOptions
  private storyTimer: number | null = null
  private timerState: StoryTimerState | null = null
  private triggerCleanupCallbacks: Array<() => void> = []

  private readonly handleSlideChange = (payload?: unknown): void => {
    const storyPayload = payload as StorySlideChangePayload | undefined

    if (!this.isOpen) return

    this.syncStory(storyPayload?.activePage ?? storyPayload?.slideIndex ?? 0)
  }

  private readonly handleCloseClick = (): void => {
    this.close()
  }

  private readonly handleMuteClick = (): void => {
    this.toggleMuted()
  }

  private readonly handleMouseEnter = (): void => {
    const { pauseOnHover } = this.pluginOptions

    if (!pauseOnHover) return

    this.pause()
  }

  private readonly handleMouseLeave = (): void => {
    const { pauseOnHover } = this.pluginOptions

    if (!pauseOnHover) return

    this.resume()
  }

  constructor($root: string, options: BSStoriesPluginOptions = {}) {
    super($root)
    this.pluginOptions = this.resolveOptions(options)
  }

  public init(): void {
    const host = this.host
    const root = this.getRootSelector

    if (!host) return
    if (!root) return

    this.ensureStoriesStyle()
    this.setupStoriesRoot(root)
    this.setupProgress(root)
    this.setupControls(root)
    this.setupTriggers()
    this.syncMutedState()
    host.on(SLIDER_EVENTS.SLIDE_CHANGE, this.handleSlideChange)
  }

  public destroy(): void {
    const host = this.host

    this.close()
    this.clearTriggers()
    this.clearTimer()
    this.destroyControls()
    this.destroyProgress()

    if (!host) return

    host.off(SLIDER_EVENTS.SLIDE_CHANGE, this.handleSlideChange)
  }

  public open(): void {
    const host = this.host
    const root = this.getRootSelector

    if (!host) return
    if (!root) return

    this.isOpen = true
    this.isPaused = false
    addClass([root], STORIES_CLASSES.OPEN)
    addClass([document.body], STORIES_CLASSES.BODY_OPEN)
    host.goTo(0)
    this.syncStory(0)
  }

  public close(): void {
    const root = this.getRootSelector

    if (!root) return

    this.isOpen = false
    this.pauseCurrentVideo()
    this.clearTimer()
    this.resetProgress()
    removeClass(root, STORIES_CLASSES.OPEN)
    removeClass(document.body, STORIES_CLASSES.BODY_OPEN)
  }

  public pause(): void {
    const remaining = this.getRemainingTime()

    this.isPaused = true
    this.timerState = this.getPausedTimerState(remaining)
    this.clearStoryTimeout()
    this.activeAnimation?.pause()
    this.pauseCurrentVideo()
  }

  public resume(): void {
    const timerState = this.timerState

    if (!this.isOpen) return
    if (!timerState) return

    this.isPaused = false
    this.activeAnimation?.play()
    this.playCurrentVideo()
    this.startTimer(timerState.remaining, timerState.duration)
  }

  private setupStoriesRoot(root: HTMLElement): void {
    addClass([root], STORIES_CLASSES.ROOT)
    setAttribute(root, ATTRIBUTES.ROLE, "dialog")
    setAttribute(root, ATTRIBUTES.ARIA_MODAL, "true")
  }

  private setupProgress(root: HTMLElement): void {
    const progressContainer = this.createProgressContainer()
    const storyCount = this.getStoryCount()

    this.destroyProgress()
    this.progressContainer = progressContainer
    this.progressBars = this.createProgressBars(storyCount)
    this.mountProgressBars(progressContainer, this.progressBars)
    appendToParent(root, progressContainer)
  }

  private mountProgressBars(
    progressContainer: HTMLElement,
    progressBars: HTMLElement[]
  ): void {
    progressBars.forEach(progressBar => {
      appendToParent(progressContainer, progressBar.parentElement as HTMLElement)
    })
  }

  private setupControls(root: HTMLElement): void {
    const closeButton = this.createControlButton(STORIES_CLASSES.CLOSE, "×")
    const muteButton = this.createControlButton(STORIES_CLASSES.MUTE, "♪")

    this.closeButton = closeButton
    this.muteButton = muteButton
    closeButton.addEventListener(EVENTS.CLICK, this.handleCloseClick)
    muteButton.addEventListener(EVENTS.CLICK, this.handleMuteClick)
    root.addEventListener(EVENTS.MOUSEENTER, this.handleMouseEnter)
    root.addEventListener(EVENTS.MOUSELEAVE, this.handleMouseLeave)
    appendToParent(root, closeButton)
    appendToParent(root, muteButton)
  }

  private setupTriggers(): void {
    const triggers = this.getTriggerElements()

    triggers.forEach(trigger => this.bindTrigger(trigger))
  }

  private bindTrigger(trigger: HTMLElement): void {
    const handleClick = (event: Event): void => {
      event.preventDefault()
      this.open()
    }

    trigger.addEventListener(EVENTS.CLICK, handleClick)
    this.triggerCleanupCallbacks.push(() => {
      trigger.removeEventListener(EVENTS.CLICK, handleClick)
    })
  }

  private syncStory(index: number): void {
    const safeIndex = this.getSafeStoryIndex(index)
    const duration = this.getCurrentStoryDuration(safeIndex)

    this.clearTimer()
    this.syncProgressState(safeIndex, duration)
    this.syncVideoState(safeIndex)
    this.startTimer(duration, duration)
  }

  private syncProgressState(index: number, duration: number): void {
    this.activeAnimation?.cancel()
    this.progressBars.forEach((progressBar, progressIndex) => {
      this.syncProgressBar(progressBar, progressIndex, index, duration)
    })
  }

  private syncProgressBar(
    progressBar: HTMLElement,
    progressIndex: number,
    activeIndex: number,
    duration: number
  ): void {
    const isCompleted = progressIndex < activeIndex
    const isActive = progressIndex === activeIndex

    removeClass(progressBar.parentElement as HTMLElement, [
      STORIES_CLASSES.ACTIVE_PROGRESS,
      STORIES_CLASSES.COMPLETED_PROGRESS
    ])

    if (isCompleted) {
      addClass(
        [progressBar.parentElement as HTMLElement],
        STORIES_CLASSES.COMPLETED_PROGRESS
      )
      this.animateProgress(progressBar, 1, 1, 0)
      return
    }

    if (isActive) {
      addClass([progressBar.parentElement as HTMLElement], STORIES_CLASSES.ACTIVE_PROGRESS)
      this.activeAnimation = this.animateProgress(
        progressBar,
        0,
        1,
        duration
      )[0]
      return
    }

    this.animateProgress(progressBar, 0, 0, 0)
  }

  private animateProgress(
    progressBar: HTMLElement,
    from: number,
    to: number,
    duration: number
  ): Animation[] {
    return this.animate(
      progressBar,
      [{ transform: `scaleX(${from})` }, { transform: `scaleX(${to})` }],
      {
        duration,
        easing: ANIMATION_OPTIONS.EASEOUT,
        fill: ANIMATION_OPTIONS.FORWARDS
      }
    )
  }

  private startTimer(time: number, duration: number): void {
    const startedAt = performance.now()

    this.timerState = { startedAt, remaining: time, duration }
    this.storyTimer = window.setTimeout(() => this.goToNextStory(), time)
  }

  private goToNextStory(): void {
    const host = this.host
    const nextIndex = this.getCurrentStoryIndex() + 1
    const isLastStory = nextIndex >= this.getStoryCount()

    if (!host) return

    if (isLastStory) {
      this.close()
      return
    }

    host.goTo(nextIndex)
  }

  private getCurrentStoryIndex(): number {
    const { activePage, slideIndex } = this.store

    return activePage ?? slideIndex ?? 0
  }

  private getCurrentStoryDuration(index: number): number {
    const storyVideo = this.getStoryVideo(index)
    const fallbackDuration = this.pluginOptions.duration

    if (!storyVideo) return fallbackDuration
    if (!Number.isFinite(storyVideo.duration))
      return this.pluginOptions.maxVideoDuration

    return Math.min(
      storyVideo.duration * 1000,
      this.pluginOptions.maxVideoDuration
    )
  }

  private syncVideoState(index: number): void {
    const storyVideo = this.getStoryVideo(index)

    this.pauseAllVideos()
    if (!storyVideo) return

    storyVideo.currentTime = 0
    storyVideo.muted = this.pluginOptions.useMuted
    storyVideo.play().catch(() => undefined)
  }

  private toggleMuted(): void {
    const currentVideo = this.getCurrentVideo()
    const useMuted = !this.pluginOptions.useMuted

    this.pluginOptions.useMuted = useMuted
    if (currentVideo) currentVideo.muted = useMuted

    this.syncMutedState()
  }

  private syncMutedState(): void {
    const muteButton = this.muteButton
    const { useMuted } = this.pluginOptions

    if (!muteButton) return

    if (useMuted) addClass([muteButton], STORIES_CLASSES.MUTED)
    else removeClass(muteButton, STORIES_CLASSES.MUTED)
  }

  private getRemainingTime(): number {
    const timerState = this.timerState
    const now = performance.now()
    const elapsed = timerState ? now - timerState.startedAt : 0

    return timerState ? Math.max(0, timerState.remaining - elapsed) : 0
  }

  private getPausedTimerState(remaining: number): StoryTimerState | null {
    const timerState = this.timerState

    if (!timerState) return null

    return {
      startedAt: performance.now(),
      remaining,
      duration: timerState.duration
    }
  }

  private getStoryCount(): number {
    const totalStories = getSliderNodeList(this.$root, false).length

    return Math.min(totalStories, this.pluginOptions.maxStories)
  }

  private getSafeStoryIndex(index: number): number {
    return Math.max(0, Math.min(index, this.getStoryCount() - 1))
  }

  private getStoryVideo(index: number): HTMLVideoElement | null {
    const slides = getSliderNodeList(this.$root, false)
    const slide = slides[index]

    return slide
      ? getAllElements<HTMLVideoElement>(TAGS.VIDEO, slide)[0] ?? null
      : null
  }

  private getCurrentVideo(): HTMLVideoElement | null {
    return this.getStoryVideo(this.getCurrentStoryIndex())
  }

  private pauseCurrentVideo(): void {
    this.getCurrentVideo()?.pause()
  }

  private playCurrentVideo(): void {
    this.getCurrentVideo()?.play().catch(() => undefined)
  }

  private pauseAllVideos(): void {
    const videos = getAllElements<HTMLVideoElement>(
      TAGS.VIDEO,
      this.getRootSelector
    )

    videos.forEach(video => video.pause())
  }

  private clearStoryTimeout(): void {
    if (this.storyTimer !== null) window.clearTimeout(this.storyTimer)

    this.storyTimer = null
  }

  private clearTimer(): void {
    this.clearStoryTimeout()
    this.activeAnimation?.cancel()
    this.activeAnimation = null
  }

  private resetProgress(): void {
    this.progressBars.forEach(progressBar => {
      this.animateProgress(progressBar, 0, 0, 0)
    })
  }

  private clearTriggers(): void {
    this.triggerCleanupCallbacks.forEach(cleanup => cleanup())
    this.triggerCleanupCallbacks = []
  }

  private destroyControls(): void {
    const root = this.getRootSelector

    this.closeButton?.removeEventListener(EVENTS.CLICK, this.handleCloseClick)
    this.muteButton?.removeEventListener(EVENTS.CLICK, this.handleMuteClick)
    root?.removeEventListener(EVENTS.MOUSEENTER, this.handleMouseEnter)
    root?.removeEventListener(EVENTS.MOUSELEAVE, this.handleMouseLeave)
    removeElement(this.closeButton)
    removeElement(this.muteButton)
    this.closeButton = null
    this.muteButton = null
  }

  private destroyProgress(): void {
    removeElement(this.progressContainer)
    this.progressContainer = null
    this.progressBars = []
  }

  private createProgressContainer(): HTMLElement {
    const progressContainer = createNewElement(TAGS.DIV)

    addClass([progressContainer], STORIES_CLASSES.PROGRESS)

    return progressContainer
  }

  private createProgressBars(storyCount: number): HTMLElement[] {
    return Array.from({ length: storyCount }, () => this.createProgressItem())
  }

  private createProgressItem(): HTMLElement {
    const progressItem = createNewElement(TAGS.DIV)
    const progressBar = createNewElement(TAGS.DIV)

    addClass([progressItem], STORIES_CLASSES.PROGRESS_ITEM)
    addClass([progressBar], STORIES_CLASSES.PROGRESS_BAR)
    appendToParent(progressItem, progressBar)

    return progressBar
  }

  private createControlButton(className: string, label: string): HTMLElement {
    const button = createNewElement(TAGS.BUTTON)

    addClass([button], className)
    setAttribute(button, ATTRIBUTES.TYPE, "button")
    setAttribute(button, ATTRIBUTES.ARIA_LABEL, label)
    button.textContent = label

    return button
  }

  private getTriggerElements(): HTMLElement[] {
    const { trigger } = this.pluginOptions

    if (!trigger) return []
    if (typeof trigger === "string")
      return Array.from(getAllElements<HTMLElement>(trigger))
    if (Array.isArray(trigger)) return trigger

    return [trigger]
  }

  private resolveOptions(
    options: BSStoriesPluginOptions
  ): ResolvedBSStoriesPluginOptions {
    const duration = this.resolveDuration(options.duration)
    const maxVideoDuration = this.resolveMaxVideoDuration(
      options.maxVideoDuration
    )
    const maxStories = this.resolveMaxStories(options.maxStories)

    return {
      trigger: options.trigger,
      duration,
      maxVideoDuration,
      maxStories,
      pauseOnHover: options.pauseOnHover ?? true,
      useMuted: options.useMuted ?? true
    }
  }

  private resolveDuration(duration?: number): number {
    if (!Number.isFinite(duration)) return STORIES_DEFAULTS.DURATION

    return Math.max(STORIES_DEFAULTS.MIN_VIDEO_DURATION, Number(duration))
  }

  private resolveMaxVideoDuration(maxVideoDuration?: number): number {
    if (!Number.isFinite(maxVideoDuration))
      return STORIES_DEFAULTS.MAX_VIDEO_DURATION
    if (Number(maxVideoDuration) > STORIES_DEFAULTS.MAX_VIDEO_DURATION) {
      console.warn(
        `[BrickSlider Stories] maxVideoDuration is too high and was capped at ${STORIES_DEFAULTS.MAX_VIDEO_DURATION}ms.`
      )
    }

    return Math.min(
      Math.max(STORIES_DEFAULTS.MIN_VIDEO_DURATION, Number(maxVideoDuration)),
      STORIES_DEFAULTS.MAX_VIDEO_DURATION
    )
  }

  private resolveMaxStories(maxStories?: number): number {
    if (!Number.isFinite(maxStories)) return STORIES_DEFAULTS.MAX_STORIES
    if (Number(maxStories) > STORIES_DEFAULTS.MAX_STORIES_LIMIT) {
      console.warn(
        `[BrickSlider Stories] maxStories is too high and was capped at ${STORIES_DEFAULTS.MAX_STORIES_LIMIT}.`
      )
    }

    return Math.min(
      Math.max(1, Math.floor(Number(maxStories))),
      STORIES_DEFAULTS.MAX_STORIES_LIMIT
    )
  }

  private ensureStoriesStyle(): void {
    const existingStyle = $(`#${STORIES_STYLE_ID}`)
    const style = this.createStoriesStyleElement()

    if (existingStyle) return

    appendToParent(document.head, style)
  }

  private createStoriesStyleElement(): HTMLStyleElement {
    const style = createNewElement(TAGS.STYLE) as HTMLStyleElement

    style.id = STORIES_STYLE_ID
    style.textContent = `
      .${STORIES_CLASSES.BODY_OPEN} { overflow: hidden; }
      .${STORIES_CLASSES.ROOT}:not(.${STORIES_CLASSES.OPEN}) { display: none !important; }
      .${STORIES_CLASSES.ROOT}.${STORIES_CLASSES.OPEN} {
        align-items: center;
        background: rgba(14, 5, 32, 0.86);
        box-sizing: border-box;
        display: flex !important;
        inset: 0;
        justify-content: center;
        padding: 24px;
        position: fixed;
        visibility: visible !important;
        z-index: 9999;
      }
      .${STORIES_CLASSES.ROOT}.${STORIES_CLASSES.OPEN} > .bs-track {
        aspect-ratio: 9 / 16;
        border-radius: 24px;
        height: min(86vh, 760px);
        max-width: min(92vw, 430px);
        overflow: hidden;
        width: auto;
      }
      .${STORIES_CLASSES.PROGRESS} {
        display: flex;
        gap: 4px;
        left: 50%;
        max-width: min(86vw, 390px);
        position: fixed;
        top: 44px;
        transform: translateX(-50%);
        width: 100%;
        z-index: 10001;
      }
      .${STORIES_CLASSES.PROGRESS_ITEM} {
        background: rgba(255,255,255,0.32);
        border-radius: 999px;
        flex: 1;
        height: 3px;
        overflow: hidden;
      }
      .${STORIES_CLASSES.PROGRESS_BAR} {
        background: #fff;
        display: block;
        height: 100%;
        transform: scaleX(0);
        transform-origin: left center;
        width: 100%;
      }
      .${STORIES_CLASSES.CLOSE}, .${STORIES_CLASSES.MUTE} {
        align-items: center;
        background: rgba(255,255,255,0.14);
        border: 0;
        border-radius: 999px;
        color: white;
        cursor: pointer;
        display: flex;
        font: inherit;
        height: 40px;
        justify-content: center;
        position: fixed;
        right: 24px;
        width: 40px;
        z-index: 10001;
      }
      .${STORIES_CLASSES.CLOSE} { top: 24px; }
      .${STORIES_CLASSES.MUTE} { top: 72px; }
      .${STORIES_CLASSES.MUTE}.${STORIES_CLASSES.MUTED} { opacity: 0.55; }
      @media (max-width: 768px) {
        .${STORIES_CLASSES.ROOT}.${STORIES_CLASSES.OPEN} { padding: 0; }
        .${STORIES_CLASSES.ROOT}.${STORIES_CLASSES.OPEN} > .bs-track {
          border-radius: 0;
          height: 100vh;
          max-width: none;
          width: 100vw;
        }
        .${STORIES_CLASSES.PROGRESS} { top: 16px; }
        .${STORIES_CLASSES.CLOSE}, .${STORIES_CLASSES.MUTE} { right: 16px; }
        .${STORIES_CLASSES.CLOSE} { top: 36px; }
        .${STORIES_CLASSES.MUTE} { top: 84px; }
      }
    `

    return style
  }
}
