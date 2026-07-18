import { Plugin } from "@sixsrc/brick-slider/api"
import {
  ANIMATION_OPTIONS,
  ATTRIBUTES,
  EVENTS,
  FROM,
  SLIDER_EVENTS,
  TAGS,
  $,
  addClass,
  appendToParent,
  closestElement,
  containsElement,
  createNewElement,
  getAttribute,
  getAllElements,
  getElement,
  getSliderNodeList,
  getTrackChildren,
  hasAttribute,
  removeAttribute,
  removeClass,
  removeElement,
  removeListener,
  prefersReducedMotion,
  setAttribute,
  listener,
  hasClass
} from "@sixsrc/brick-slider/api"
import {
  STORIES_CLASSES,
  STORIES_DEFAULTS,
  STORIES_EVENTS,
  STORIES_ICONS,
  STORIES_KEYBOARD_KEYS,
  STORIES_LABELS
} from "./constants"
import { Messages } from "./Messages"
import type {
  BSStoriesPluginOptions,
  BrickSliderStoriesHostMethods,
  ResolvedBSStoriesPluginOptions,
  BrickSliderStoriesSlideChangePayload,
  StoryTimerState
} from "./types"

export class BrickSliderStories extends Plugin {
  private activeAnimation: Animation | null = null
  private activeStoryIndex = 0
  private closeButton: HTMLElement | null = null
  private controlCleanupCallbacks: Array<() => void> = []
  private isOpen = false
  private isPaused = false
  private isStoryHovered = false
  private isTouchHoldingStory = false
  private lastControlPointerTime = 0
  private muteButton: HTMLElement | null = null
  private pauseIndicator: HTMLElement | null = null
  private storiesLayer: HTMLElement | null = null
  private createdElements = new Set<HTMLElement>()
  private progressBars: HTMLElement[] = []
  private progressCleanupCallbacks: Array<() => void> = []
  private progressContainer: HTMLElement | null = null
  private readonly pluginOptions: ResolvedBSStoriesPluginOptions
  private hostMethods: BrickSliderStoriesHostMethods | null = null
  private isDraggingStory = false
  private storyPointerStartX: number | null = null
  private storyTouchStartX: number | null = null
  private storyTimer: number | null = null
  private timerState: StoryTimerState | null = null
  private triggerCleanupCallbacks: Array<() => void> = []
  private warnedMultipleVideoStories = new Set<number>()
  private lastTriggerElement: HTMLElement | null = null
  private mediaCleanupCallbacks: Array<() => void> = []
  private mobileControlsTimer: number | null = null
  private readonly hiddenBackgroundElements = new Map<
    HTMLElement,
    { ariaHidden: string | null; inert: boolean }
  >()
  private shouldResumeAfterTouchHold = false
  private isTouchControlsVisible = false

  private readonly handleSlideChange = (payload?: unknown): void => {
    const storyPayload = payload as BrickSliderStoriesSlideChangePayload | undefined
    const storyIndex = this.getStoryIndexFromPayload(storyPayload)
    const safeIndex = this.getSafeStoryIndex(storyIndex)
    const isCurrentStory = safeIndex === this.activeStoryIndex
    const shouldRestartCurrentStory = this.isDraggingStory || this.isPaused

    if (!this.isOpen) return
    if (isCurrentStory && !shouldRestartCurrentStory) return

    this.syncStory(safeIndex)
  }

  private readonly handleCloseClick = (event: Event): void => {
    if (!this.isPrimaryControlEvent(event)) return

    event.preventDefault()
    event.stopImmediatePropagation()
    event.stopPropagation()
    this.close()
  }

  private readonly handleMuteClick = (event?: Event): void => {
    if (event && !this.isPrimaryControlEvent(event)) return

    event?.preventDefault()
    event?.stopImmediatePropagation()
    event?.stopPropagation()
    this.toggleMuted()
  }

  private readonly handlePauseClick = (event?: Event): void => {
    if (event && !this.isPrimaryControlEvent(event)) return

    event?.preventDefault()
    event?.stopImmediatePropagation()
    event?.stopPropagation()
    this.togglePause()
  }

  private readonly handleWindowControl = (event: Event): void => {
    if (!this.isPrimaryControlEvent(event)) return

    const control = this.getControlFromEvent(event)

    if (!control) return

    event.preventDefault()
    event.stopPropagation()
    if (control === STORIES_CLASSES.CLOSE) {
      this.close()
    }
  }

  private readonly handleWindowMouseMove = (event: MouseEvent): void => {
    const isPointerInsideStory = this.isPointerInsideStoryRect(event)

    if (!this.isOpen) return
    if (this.isStoryHoverBlockedByControl(event)) {
      this.isStoryHovered = false
      this.syncPausedState()
      return
    }

    if (isPointerInsideStory) {
      this.showPauseControl()
      return
    }

    this.isStoryHovered = false
    this.syncPausedState()
  }

  private readonly handleKeydown = (event: KeyboardEvent): void => {
    const isSpaceKey = event.key === STORIES_KEYBOARD_KEYS.SPACE
    const isEscapeKey = event.key === STORIES_KEYBOARD_KEYS.ESCAPE
    const isTabKey = event.key === STORIES_KEYBOARD_KEYS.TAB

    if (!this.isOpen) return

    if (isEscapeKey) {
      event.preventDefault()
      this.close()
      return
    }

    if (isTabKey) {
      this.trapFocus(event)
      return
    }

    if (!isSpaceKey) return

    event.preventDefault()
    this.togglePause()
  }

  private readonly handleMouseEnter = (event: MouseEvent): void => {
    if (this.isStoryHoverBlockedByControl(event)) {
      this.isStoryHovered = false
      this.syncPausedState()
      return
    }

    this.showPauseControl()
  }

  private readonly handleMouseMove = (event: MouseEvent): void => {
    if (this.isStoryHoverBlockedByControl(event)) {
      this.isStoryHovered = false
      this.syncPausedState()
      return
    }

    this.syncPauseHoverFromPointer()
  }

  private readonly handleStoryPointerDown = (event: PointerEvent): void => {
    if (event.pointerType !== FROM.TOUCH) return
    if (!this.isOpen) return
    if (this.isInteractiveStoryControlTarget(event.target)) return

    this.isTouchHoldingStory = true
    this.isStoryHovered = false
    this.shouldResumeAfterTouchHold = !this.isPaused

    if (this.shouldResumeAfterTouchHold) this.pause()
    else this.syncPausedState()
  }

  private readonly handleStoryPointerUp = (event?: PointerEvent): void => {
    if (event && event.pointerType !== FROM.TOUCH) return
    if (!this.isTouchHoldingStory) return

    this.isTouchHoldingStory = false

    if (this.shouldResumeAfterTouchHold) this.resume()
    else this.syncPausedState()

    this.shouldResumeAfterTouchHold = false
  }

  private showPauseControl(): void {
    const { pauseOnHover } = this.pluginOptions

    if (!pauseOnHover) return

    this.isStoryHovered = true
    this.syncPausedState()
  }

  private readonly handleMouseLeave = (): void => {
    const { pauseOnHover } = this.pluginOptions

    if (!pauseOnHover) return

    this.isStoryHovered = false
    this.syncPausedState()
  }

  private syncPauseHoverFromPointer(): void {
    const isPointerInsideStory = this.isPointerInsideStoryControlArea()

    if (isPointerInsideStory) {
      this.showPauseControl()
      return
    }

    this.isStoryHovered = false
    this.syncPausedState()
  }

  constructor(options?: BSStoriesPluginOptions)
  constructor($root: string, options?: BSStoriesPluginOptions)
  constructor(
    rootOrOptions: string | BSStoriesPluginOptions = {},
    maybeOptions: BSStoriesPluginOptions = {}
  ) {
    const hasExplicitRoot = typeof rootOrOptions === "string"
    const $root = hasExplicitRoot ? rootOrOptions : undefined
    const options = hasExplicitRoot ? maybeOptions : rootOrOptions

    super($root)
    this.pluginOptions = this.resolveOptions(options)
  }

  public override setHost(host: NonNullable<typeof this.host>): void {
    super.setHost(host)
    this.applyStoriesHostState()
  }

  public init(): void {
    const host = this.host
    const isValidMarkup = this.validateMarkup()
    const root = this.getRootSelector

    if (!isValidMarkup) return
    if (!host) return
    if (!root) return

    this.setupStoriesRoot(root)
    this.setupStoriesLayer(root)
    this.setupProgress(root)
    this.setupControls(root)
    this.setupEdgeSwipeLock(root)
    this.setupTriggers()
    this.wrapHostNavigation(host)
    this.syncMutedState()
    listener(
      [EVENTS.POINTERDOWN, EVENTS.MOUSEDOWN, EVENTS.TOUCHSTART, EVENTS.CLICK],
      window,
      this.handleWindowControl,
      true
    )
    listener([EVENTS.MOUSEMOVE], window, this.handleWindowMouseMove)
    listener([EVENTS.KEYDOWN], document, this.handleKeydown)
    host.on(SLIDER_EVENTS.SLIDE_CHANGE, this.handleSlideChange)
  }

  private applyStoriesHostState(): void {
    this.setState({
      gap: 0,
      slidesPerView: 1,
      slidesPerPage: 1,
      baseSlidesPerView: 1,
      baseSlidesPerPage: 1,
      slideSizes: {},
      baseSlideSizes: {},
      screens: {},
      responsive: {},
      activeBreakpoint: "base",
      useLoop: false,
      useDragFree: false,
      useAutoHeight: false
    })
  }

  private validateMarkup(): boolean {
    const message = new Messages(this.$root)

    message.displayMessage()

    return message.isValid()
  }

  public destroy(): void {
    const host = this.host

    this.restoreHostNavigation()
    this.close()
    this.clearTriggers()
    this.clearTimer()
    this.destroyControls()
    this.destroyProgress()
    this.destroyEdgeSwipeLock()
    removeListener(
      [EVENTS.POINTERDOWN, EVENTS.MOUSEDOWN, EVENTS.TOUCHSTART, EVENTS.CLICK],
      window,
      this.handleWindowControl,
      true
    )
    removeListener([EVENTS.MOUSEMOVE], window, this.handleWindowMouseMove)
    removeListener([EVENTS.KEYDOWN], document, this.handleKeydown)

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
    removeClass(root, STORIES_CLASSES.ROOT_HIDDEN)
    this.hideBackgroundFromAssistiveTech(root)
    this.showStoriesLayer()
    window.requestAnimationFrame(() => {
      this.focusInitialControl()
    })
    this.goToStory(0)
    this.emitStoriesLifecycle(STORIES_EVENTS.OPENED)
    this.emitStoriesMountedWhenReady()
  }

  public close(): void {
    const host = this.host
    const root = this.getRootSelector

    if (!root) return

    this.isOpen = false
    this.isPaused = false
    this.isDraggingStory = false
    this.isTouchHoldingStory = false
    this.shouldResumeAfterTouchHold = false
    this.isStoryHovered = false
    this.storyPointerStartX = null
    this.storyTouchStartX = null
    this.pauseCurrentVideo()
    this.clearTimer()
    this.timerState = null
    this.resetProgress()
    removeClass(root, STORIES_CLASSES.OPEN)
    removeClass(root, STORIES_CLASSES.PAUSED)
    removeClass(document.body, STORIES_CLASSES.BODY_OPEN)
    addClass([root], STORIES_CLASSES.ROOT_HIDDEN)
    this.hideStoriesLayer()
    this.activeStoryIndex = 0
    host?.goTo(0)
    this.restoreBackgroundForAssistiveTech()
    this.restoreTriggerFocus()
    this.emitStoriesLifecycle(STORIES_EVENTS.CLOSED)
  }

  public pause(): void {
    const remaining = this.getRemainingTime()

    if (this.isPaused) return

    this.isPaused = true
    this.timerState = this.getPausedTimerState(remaining)
    this.syncPausedState()
    this.clearStoryTimeout()
    this.activeAnimation?.pause()
    this.pauseCurrentVideo()
  }

  public resume(): void {
    const timerState = this.timerState

    if (!this.isOpen) return
    if (!this.isPaused) return
    if (!timerState) return

    this.isPaused = false
    this.syncPausedState()
    this.activeAnimation?.play()
    this.playCurrentVideo()
    this.startTimer(timerState.remaining, timerState.duration)
  }

  private emitStoriesMountedWhenReady(): void {
    const root = this.getRootSelector

    if (!root) return

    let pendingFrame = 0
    let attempts = 0
    const maxAttempts = 24

    const hasMountedStoriesDom = (): boolean => {
      const track = this.getStoriesTrack()
      const storiesLayer = this.storiesLayer
      const slides = getSliderNodeList(this.$root, false)
      const activeSlide = slides[this.activeStoryIndex]
      const trackWidth = track?.getBoundingClientRect().width ?? 0
      const slideWidth = activeSlide?.getBoundingClientRect().width ?? 0
      const isRootHidden = hasClass(root, STORIES_CLASSES.ROOT_HIDDEN)
      const isLayerHidden = storiesLayer
        ? hasClass(storiesLayer, STORIES_CLASSES.LAYER_HIDDEN)
        : false

      if (!this.isOpen) return false
      if (!track || !storiesLayer || this.progressBars.length === 0)
        return false
      if (isRootHidden || isLayerHidden) return false

      return trackWidth > 0 && slideWidth > 0
    }

    const scheduleMountedCheck = (): void => {
      if (pendingFrame) return

      pendingFrame = requestAnimationFrame(() => {
        pendingFrame = 0
        attempts += 1

        if (hasMountedStoriesDom()) {
          requestAnimationFrame(() => {
            this.focusInitialControl()
            this.emitStoriesLifecycle(STORIES_EVENTS.MOUNTED)
          })
          return
        }

        if (attempts < maxAttempts) {
          scheduleMountedCheck()
        }
      })
    }

    scheduleMountedCheck()
  }

  private emitStoriesLifecycle(eventName: string): void {
    this.emit(eventName, this.$root)
  }

  private focusInitialControl(): void {
    const closeButton = this.closeButton as HTMLElement | null
    const root = this.getRootSelector

    if (closeButton) {
      window.requestAnimationFrame(() => {
        closeButton.focus({ preventScroll: true })
      })
      return
    }

    root?.focus({ preventScroll: true })
  }

  private restoreTriggerFocus(): void {
    this.lastTriggerElement?.focus()
  }

  private trapFocus(event: KeyboardEvent): void {
    const focusableElements = this.getFocusableElements()
    const activeElement = document.activeElement as HTMLElement | null
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (focusableElements.length === 0) {
      event.preventDefault()
      this.getRootSelector?.focus()
      return
    }

    if (
      !activeElement ||
      !containsElement(this.getRootSelector, activeElement)
    ) {
      event.preventDefault()
      firstElement?.focus()
      return
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault()
      firstElement?.focus()
      return
    }

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault()
      lastElement?.focus()
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const root = this.getRootSelector

    if (!root) return []

    const selector = [
      "button:not([disabled])",
      "[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])'
    ].join(",")

    return Array.from(getAllElements<HTMLElement>(selector, root)).filter(
      element => !hasAttribute(element, ATTRIBUTES.ARIA_HIDDEN)
    )
  }

  private hideBackgroundFromAssistiveTech(root: HTMLElement): void {
    this.hiddenBackgroundElements.clear()
    this.getBackgroundSiblings(root).forEach(element => {
      this.hiddenBackgroundElements.set(element, {
        ariaHidden: getAttribute(element, ATTRIBUTES.ARIA_HIDDEN),
        inert: element.inert
      })
      setAttribute(element, ATTRIBUTES.ARIA_HIDDEN, "true")
      element.inert = true
    })
  }

  private restoreBackgroundForAssistiveTech(): void {
    this.hiddenBackgroundElements.forEach((state, element) => {
      if (state.ariaHidden === null)
        removeAttribute(element, ATTRIBUTES.ARIA_HIDDEN)
      else setAttribute(element, ATTRIBUTES.ARIA_HIDDEN, state.ariaHidden)

      element.inert = state.inert
    })
    this.hiddenBackgroundElements.clear()
  }

  private getBackgroundSiblings(root: HTMLElement): HTMLElement[] {
    const siblings: HTMLElement[] = []
    const storiesLayer = this.storiesLayer
    let current: HTMLElement | null = root

    while (current?.parentElement) {
      const parent: HTMLElement = current.parentElement

      Array.from(parent.children).forEach(child => {
        if (!(child instanceof HTMLElement)) return
        if (child === current) return
        if (storiesLayer && child === storiesLayer) return
        if (containsElement(storiesLayer, child)) return

        siblings.push(child)
      })

      current = parent
      if (parent === document.body) break
    }

    return siblings
  }

  private setupStoriesRoot(root: HTMLElement): void {
    addClass([root], STORIES_CLASSES.ROOT)
    addClass([root], STORIES_CLASSES.ROOT_HIDDEN)
    setAttribute(root, ATTRIBUTES.ROLE, "dialog")
    setAttribute(root, ATTRIBUTES.ARIA_MODAL, "true")
    setAttribute(root, ATTRIBUTES.TABINDEX, "-1")

    if (!hasAttribute(root, ATTRIBUTES.ARIA_LABEL)) {
      setAttribute(root, ATTRIBUTES.ARIA_LABEL, "Stories dialog")
    }
  }

  private setupStoriesLayer(root: HTMLElement): void {
    const existingLayer = this.getStoriesElement(STORIES_CLASSES.LAYER)
    const storiesLayer = existingLayer ?? this.createStoriesLayer()
    const shouldMountLayer = !existingLayer

    this.storiesLayer = storiesLayer
    if (shouldMountLayer) appendToParent(root, storiesLayer)
  }

  private createStoriesLayer(): HTMLElement {
    const storiesLayer = createNewElement(TAGS.DIV)

    addClass([storiesLayer], STORIES_CLASSES.LAYER)
    this.createdElements.add(storiesLayer)

    return storiesLayer
  }

  private showStoriesLayer(): void {
    const storiesLayer = this.storiesLayer

    if (!storiesLayer) return

    removeClass(storiesLayer, STORIES_CLASSES.LAYER_HIDDEN)
  }

  private hideStoriesLayer(): void {
    const storiesLayer = this.storiesLayer

    if (!storiesLayer) return

    addClass([storiesLayer], STORIES_CLASSES.LAYER_HIDDEN)
  }

  private setupProgress(root: HTMLElement): void {
    const storiesLayer = this.storiesLayer ?? root
    const progressContainer =
      this.getStoriesElement(STORIES_CLASSES.PROGRESS) ??
      this.createProgressContainer()
    const storyCount = this.getStoryCount()
    const progressTemplate = this.getProgressItemTemplate(progressContainer)
    const shouldMountProgress = !progressContainer.parentElement

    this.destroyProgress()
    progressContainer.replaceChildren()
    this.progressContainer = progressContainer
    this.progressBars = this.createProgressBars(storyCount, progressTemplate)
    this.mountProgressBars(progressContainer, this.progressBars)
    if (shouldMountProgress) appendToParent(storiesLayer, progressContainer)
  }

  private mountProgressBars(
    progressContainer: HTMLElement,
    progressBars: HTMLElement[]
  ): void {
    progressBars.forEach((progressBar, index) => {
      const progressItem = progressBar.parentElement as HTMLElement

      this.bindProgressItem(progressItem, index)
      appendToParent(progressContainer, progressItem)
    })
  }

  private bindProgressItem(progressItem: HTMLElement, index: number): void {
    this.setProgressItemAccessibility(progressItem, index)

    const handleProgressClick = (event: Event): void => {
      event.preventDefault()
      event.stopImmediatePropagation()
      event.stopPropagation()
      this.goToStory(index)
    }

    progressItem.onclick = handleProgressClick
    progressItem.onpointerdown = handleProgressClick
    this.progressCleanupCallbacks.push(() => {
      progressItem.onclick = null
      progressItem.onpointerdown = null
    })
  }

  private setProgressItemAccessibility(
    progressItem: HTMLElement,
    index: number
  ): void {
    const isNativeButton = progressItem.tagName.toLowerCase() === TAGS.BUTTON

    if (isNativeButton) {
      setAttribute(progressItem, ATTRIBUTES.TYPE, "button")
      removeAttribute(progressItem, ATTRIBUTES.ROLE)
    } else {
      setAttribute(progressItem, ATTRIBUTES.ROLE, "button")
      setAttribute(progressItem, ATTRIBUTES.TABINDEX, "0")
    }

    if (!hasAttribute(progressItem, ATTRIBUTES.ARIA_LABEL)) {
      setAttribute(progressItem, ATTRIBUTES.ARIA_LABEL, `Go to story ${index + 1}`)
    }
  }

  private setupEdgeSwipeLock(root: HTMLElement): void {
    listener([EVENTS.MOUSEDOWN], root, this.handleStoryMouseDown, true)
    listener([EVENTS.MOUSEMOVE], root, this.handleStoryMouseMove, true)
    listener(
      [EVENTS.MOUSEUP, EVENTS.MOUSELEAVE],
      root,
      this.handleStoryPointerEnd
    )
    listener([EVENTS.TOUCHSTART], root, this.handleStoryTouchStart, true)
    listener([EVENTS.TOUCHMOVE], root, this.handleStoryTouchMove, true)
    listener([EVENTS.TOUCHEND], root, this.handleStoryPointerEnd)
  }

  private readonly handleStoryMouseDown = (event: MouseEvent): void => {
    const isControlTarget = this.isStoryControlTarget(event.target)

    if (isControlTarget) return

    this.storyPointerStartX = event.clientX
    this.startStoryDrag()
  }

  private readonly handleStoryMouseMove = (event: MouseEvent): void => {
    const pointerStartX = this.storyPointerStartX
    const deltaX = pointerStartX !== null ? event.clientX - pointerStartX : 0
    const isDragging = event.buttons > 0
    const shouldLockSwipe = this.shouldLockEdgeSwipe(deltaX)

    if (!isDragging) return
    if (!shouldLockSwipe) return

    event.preventDefault()
    event.stopImmediatePropagation()
  }

  private readonly handleStoryTouchStart = (event: TouchEvent): void => {
    const touch = event.touches[0]
    const isControlTarget = this.isStoryControlTarget(event.target)

    this.showTouchControlsTemporarily()

    if (isControlTarget) return

    this.storyTouchStartX = touch?.clientX ?? null
    this.startStoryDrag()
  }

  private readonly handleStoryTouchMove = (event: TouchEvent): void => {
    const touch = event.touches[0]
    const touchStartX = this.storyTouchStartX
    const deltaX =
      touch && touchStartX !== null ? touch.clientX - touchStartX : 0
    const shouldLockSwipe = this.shouldLockEdgeSwipe(deltaX)

    if (!shouldLockSwipe) return

    event.preventDefault()
    event.stopImmediatePropagation()
  }

  private readonly handleStoryPointerEnd = (): void => {
    this.scheduleTouchControlsHide()

    if (!this.isDraggingStory) return

    this.isDraggingStory = false
    window.requestAnimationFrame(() => this.resumeStoryAfterPointerEnd())
  }

  private resumeStoryAfterPointerEnd(): void {
    const { slideIndex } = this.store
    const storyIndex = this.getSafeStoryIndex(slideIndex)
    const didChangeStory = storyIndex !== this.activeStoryIndex

    if (didChangeStory) {
      this.syncStory(storyIndex)
      return
    }

    this.resumeStoryClock()
  }

  private startStoryDrag(): void {
    if (!this.isOpen) return

    this.isDraggingStory = true
    this.pauseStoryClock()
  }

  private pauseStoryClock(): void {
    const remaining = this.getRemainingTime()

    if (this.isPaused) return

    this.timerState = this.getPausedTimerState(remaining)
    this.clearStoryTimeout()
    this.activeAnimation?.pause()
    this.pauseCurrentVideo()
  }

  private resumeStoryClock(): void {
    const timerState = this.timerState

    if (this.isPaused) return
    if (!timerState) return

    this.activeAnimation?.play()
    this.playCurrentVideo()
    this.startTimer(timerState.remaining, timerState.duration)
  }

  private shouldLockEdgeSwipe(deltaX: number): boolean {
    const currentIndex = this.getCurrentStoryIndex()
    const lastIndex = this.getStoryCount() - 1
    const isDraggingPastStart = currentIndex === 0 && deltaX > 0
    const isDraggingPastEnd = currentIndex === lastIndex && deltaX < 0

    return isDraggingPastStart || isDraggingPastEnd
  }

  private isStoryControlTarget(target: EventTarget | null): boolean {
    const element = target instanceof Element ? target : null

    if (!element) return false

    return Boolean(
      closestElement(element, `.${STORIES_CLASSES.CLOSE}`) ||
        closestElement(element, `.${STORIES_CLASSES.MUTE}`) ||
        closestElement(element, `.${STORIES_CLASSES.PAUSE_INDICATOR}`) ||
        closestElement(element, `.${STORIES_CLASSES.PAUSE}`) ||
        closestElement(element, `.${STORIES_CLASSES.PLAY}`) ||
        closestElement(element, `.${STORIES_CLASSES.PROGRESS_ITEM}`)
    )
  }

  private setupControls(root: HTMLElement): void {
    const storiesLayer = this.storiesLayer ?? root
    const closeButton =
      this.getStoriesElement(STORIES_CLASSES.CLOSE) ??
      this.createControlButton(
        STORIES_CLASSES.CLOSE,
        STORIES_LABELS.CLOSE,
        STORIES_ICONS.CLOSE
      )
    const muteButton =
      this.getStoriesElement(STORIES_CLASSES.MUTE) ??
      (this.hasVideos() ? this.createMuteControl() : null)
    const pauseIndicator =
      this.getStoriesElement(STORIES_CLASSES.PAUSE_INDICATOR) ??
      this.createPauseControl()

    this.closeButton = closeButton
    this.muteButton = muteButton
    this.pauseIndicator = pauseIndicator
    this.prepareControlButton(closeButton, STORIES_LABELS.CLOSE)
    this.prepareControlButton(muteButton, STORIES_LABELS.MUTE)
    this.prepareControlButton(pauseIndicator, STORIES_LABELS.PAUSE)
    this.hideMediaControls()
    this.bindCloseControlEvents(closeButton)
    this.bindClickControlEvents(muteButton, this.handleMuteClick)
    this.bindClickControlEvents(pauseIndicator, this.handlePauseClick)
    this.bindTrackHoverEvents()
    this.mountStoriesElement(storiesLayer, closeButton)
    this.mountStoriesElement(storiesLayer, muteButton)
    this.mountStoriesElement(storiesLayer, pauseIndicator)
  }

  private bindCloseControlEvents(element: HTMLElement | null): void {
    const closeEvents = [
      EVENTS.POINTERDOWN,
      EVENTS.MOUSEDOWN,
      EVENTS.TOUCHSTART,
      EVENTS.CLICK
    ]

    if (!element) return

    closeEvents.forEach(eventName => {
      listener([eventName], element, this.handleCloseClick, true)
      this.controlCleanupCallbacks.push(() => {
        removeListener([eventName], element, this.handleCloseClick, true)
      })
    })
  }

  private bindClickControlEvents(
    element: HTMLElement | null,
    handler: (event: Event) => void
  ): void {
    if (!element) return

    const handlePointerControl = (event: Event): void => {
      this.lastControlPointerTime = performance.now()
      handler(event)
    }
    const handleClickControl = (event: Event): void => {
      const isSyntheticClickAfterPointer =
        performance.now() - this.lastControlPointerTime < 350

      if (isSyntheticClickAfterPointer) {
        event.preventDefault()
        event.stopImmediatePropagation()
        event.stopPropagation()
        return
      }

      handler(event)
    }

    listener([EVENTS.POINTERDOWN], element, handlePointerControl, true)
    listener([EVENTS.CLICK], element, handleClickControl, true)
    this.controlCleanupCallbacks.push(() => {
      removeListener([EVENTS.POINTERDOWN], element, handlePointerControl, true)
      removeListener([EVENTS.CLICK], element, handleClickControl, true)
    })
  }

  private isPrimaryControlEvent(event: Event): boolean {
    if (typeof PointerEvent !== "undefined" && event instanceof PointerEvent)
      return event.button === 0
    if (event instanceof MouseEvent) return event.button === 0

    return true
  }

  private bindTrackHoverEvents(): void {
    const track = this.getStoriesTrack()

    if (!track) return

    listener([EVENTS.MOUSEENTER], track, this.handleMouseEnter)
    listener([EVENTS.MOUSEMOVE], track, this.handleMouseMove)
    listener([EVENTS.MOUSELEAVE], track, this.handleMouseLeave)
    listener([EVENTS.POINTERDOWN], track, this.handleStoryPointerDown)
    listener(
      [EVENTS.POINTERUP, EVENTS.POINTERCANCEL],
      track,
      this.handleStoryPointerUp
    )
  }

  private mountStoriesElement(
    storiesLayer: HTMLElement,
    element: HTMLElement | null
  ): void {
    if (!element) return
    if (element.parentElement) return
    if (containsElement(storiesLayer, element)) return

    appendToParent(storiesLayer, element)
  }

  private setupTriggers(): void {
    const triggers = this.getTriggerElements()

    triggers.forEach(trigger => this.bindTrigger(trigger))
  }

  private bindTrigger(trigger: HTMLElement): void {
    const handleClick = (event: Event): void => {
      event.preventDefault()
      this.lastTriggerElement = trigger
      this.open()
    }

    listener([EVENTS.CLICK], trigger, handleClick)
    this.triggerCleanupCallbacks.push(() => {
      removeListener([EVENTS.CLICK], trigger, handleClick)
    })
  }

  private wrapHostNavigation(host: NonNullable<typeof this.host>): void {
    const originalNext = host.next.bind(host)
    const originalPrev = host.prev.bind(host)
    const originalGoTo = host.goTo.bind(host)

    this.hostMethods = {
      next: originalNext,
      prev: originalPrev,
      goTo: originalGoTo
    }

    host.next = (): void => {
      const targetIndex = this.getAdjacentStoryIndex(1)

      originalNext()
      this.syncHostNavigation(targetIndex)
    }

    host.prev = (): void => {
      const targetIndex = this.getAdjacentStoryIndex(-1)

      originalPrev()
      this.syncHostNavigation(targetIndex)
    }

    host.goTo = (index: number): void => {
      originalGoTo(index)
      this.syncHostNavigation(index)
    }
  }

  private restoreHostNavigation(): void {
    const host = this.host
    const hostMethods = this.hostMethods

    if (!host || !hostMethods) return

    host.next = hostMethods.next
    host.prev = hostMethods.prev
    host.goTo = hostMethods.goTo
    this.hostMethods = null
  }

  private getAdjacentStoryIndex(offset: number): number {
    const { activePage, slideIndex } = this.store
    const currentIndex =
      typeof slideIndex === "number"
        ? slideIndex
        : typeof activePage === "number"
          ? activePage
          : this.activeStoryIndex

    return this.getSafeStoryIndex(currentIndex + offset)
  }

  private syncHostNavigation(targetIndex: number): void {
    if (!this.isOpen) return

    window.requestAnimationFrame(() => {
      this.syncStory(targetIndex)
    })
  }

  private syncStory(index: number): void {
    const safeIndex = this.getSafeStoryIndex(index)
    const duration = this.getCurrentStoryDuration(safeIndex)

    this.activeStoryIndex = safeIndex
    this.isPaused = false
    this.isDraggingStory = false
    this.storyPointerStartX = null
    this.storyTouchStartX = null
    this.clearTimer()
    this.syncMultipleVideoControls(safeIndex)
    this.syncProgressState(safeIndex, duration)
    this.syncVideoState(safeIndex)
    this.syncMediaControls(safeIndex)
    this.syncPausedState()
    this.startTimer(duration, duration)
  }

  private syncProgressState(index: number, duration: number): void {
    this.activeAnimation?.cancel()
    this.activeAnimation = null
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
    const progressItem = progressBar.parentElement as HTMLElement

    this.resetProgressItemState(progressItem)

    if (isCompleted) {
      this.setCompletedProgressItem(progressItem)
      this.animateProgress(progressBar, 1, 1, 0)
      return
    }

    if (isActive) {
      this.setActiveProgressItem(progressItem)
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

  private resetProgressItemState(progressItem: HTMLElement): void {
    removeClass(progressItem, [
      STORIES_CLASSES.ACTIVE_PROGRESS,
      STORIES_CLASSES.COMPLETED_PROGRESS
    ])
  }

  private setActiveProgressItem(progressItem: HTMLElement): void {
    addClass([progressItem], STORIES_CLASSES.ACTIVE_PROGRESS)
  }

  private setCompletedProgressItem(progressItem: HTMLElement): void {
    addClass([progressItem], STORIES_CLASSES.COMPLETED_PROGRESS)
  }

  private animateProgress(
    progressBar: HTMLElement,
    from: number,
    to: number,
    duration: number
  ): Animation[] {
    progressBar.getAnimations().forEach(animation => animation.cancel())
    progressBar.style.transformOrigin = "left center"
    progressBar.style.scale = `${from} 1`

    if (prefersReducedMotion() || duration <= 0 || from === to) {
      progressBar.style.scale = `${to} 1`
      return []
    }

    const animations = this.animate(
      progressBar,
      [{ scale: `${from} 1` }, { scale: `${to} 1` }],
      {
        duration,
        easing: ANIMATION_OPTIONS.LINEAR,
        fill: ANIMATION_OPTIONS.FORWARDS
      }
    )

    animations.forEach(animation => animation.play())

    return animations
  }

  private startTimer(time: number, duration: number): void {
    const startedAt = performance.now()

    this.clearStoryTimeout()
    this.timerState = { startedAt, remaining: time, duration }
    this.storyTimer = window.setTimeout(() => this.goToNextStory(), time)
  }

  private goToNextStory(): void {
    const nextIndex = this.getCurrentStoryIndex() + 1
    const isLastStory = nextIndex >= this.getStoryCount()
    const { closeOnEnd } = this.pluginOptions

    if (isLastStory) {
      if (closeOnEnd) this.close()
      else this.pause()
      return
    }

    this.goToStory(nextIndex)
  }

  private goToStory(index: number): void {
    const host = this.host
    const safeIndex = this.getSafeStoryIndex(index)

    if (!host) return

    host.goTo(safeIndex)
    this.syncStory(safeIndex)
  }

  private getCurrentStoryIndex(): number {
    return this.activeStoryIndex
  }

  private getStoryIndexFromPayload(
    storyPayload?: BrickSliderStoriesSlideChangePayload
  ): number {
    return storyPayload?.slideIndex ?? storyPayload?.activePage ?? 0
  }

  private getCurrentStoryDuration(index: number): number {
    const storyVideo = this.getPlayableStoryVideo(index)
    const fallbackDuration = this.pluginOptions.duration

    if (!storyVideo) return fallbackDuration
    if (!Number.isFinite(storyVideo.duration)) return fallbackDuration

    return Math.min(
      storyVideo.duration * 1000,
      this.pluginOptions.maxVideoDuration
    )
  }

  private syncVideoState(index: number): void {
    const storyVideo = this.getPlayableStoryVideo(index)

    this.pauseAllVideos()
    if (!storyVideo) return

    storyVideo.currentTime = 0
    storyVideo.muted = this.pluginOptions.useMuted
    storyVideo.play().catch(() => undefined)
  }

  private syncMediaControls(index: number): void {
    const storyVideo = this.getPlayableStoryVideo(index)

    this.bindMediaStateEvents(storyVideo)
    this.syncMuteControl(storyVideo)
    this.syncMutedState(storyVideo)
  }

  private syncMuteControl(storyVideo: HTMLVideoElement | null): void {
    const muteButton = this.muteButton

    if (!muteButton) return
    if (!storyVideo) {
      addClass([muteButton], STORIES_CLASSES.HIDDEN)
      return
    }

    removeClass(muteButton, STORIES_CLASSES.HIDDEN)
    const hasAudio = this.hasVideoAudio(storyVideo)
    this.syncMuteDisabledState(muteButton, hasAudio)
    this.syncMuteControlVisibility(muteButton)
  }

  private syncMuteDisabledState(
    muteButton: HTMLElement,
    hasAudio: boolean
  ): void {
    const button = muteButton as HTMLButtonElement

    button.disabled = !hasAudio
    setAttribute(muteButton, ATTRIBUTES.ARIA_DISABLED, String(!hasAudio))

    if (hasAudio) removeClass(muteButton, STORIES_CLASSES.MUTE_DISABLED)
    else addClass([muteButton], STORIES_CLASSES.MUTE_DISABLED)
  }

  private hideMediaControls(): void {
    const muteButton = this.muteButton
    const pauseIndicator = this.pauseIndicator

    this.isTouchControlsVisible = false
    this.clearMobileControlsTimer()

    if (muteButton) addClass([muteButton], STORIES_CLASSES.HIDDEN)
    if (pauseIndicator) {
      addClass([pauseIndicator], STORIES_CLASSES.HIDDEN)
      this.syncPauseControlIcon(pauseIndicator)
    }
  }

  private toggleMuted(): void {
    const currentVideo = this.getCurrentVideo()
    const hasAudio = currentVideo ? this.hasVideoAudio(currentVideo) : false

    if (!currentVideo) return
    if (!hasAudio) return

    const useMuted = !this.isVideoMuted(currentVideo)
    this.pluginOptions.useMuted = useMuted
    currentVideo.muted = useMuted
    if (!useMuted && currentVideo.volume === 0) currentVideo.volume = 1

    this.syncMutedState(currentVideo)
  }

  private syncMutedState(storyVideo?: HTMLVideoElement | null): void {
    const muteButton = this.muteButton
    const currentVideo = storyVideo ?? this.getCurrentVideo()
    const useMuted = currentVideo ? this.isVideoMuted(currentVideo) : true

    if (!muteButton) return

    this.pluginOptions.useMuted = useMuted

    if (useMuted) addClass([muteButton], STORIES_CLASSES.MUTED)
    else removeClass(muteButton, STORIES_CLASSES.MUTED)

    const muteOnIcon =
      getElement<HTMLElement>(`.${STORIES_CLASSES.MUTE_ON}`, muteButton) ?? null
    const muteOffIcon =
      getElement<HTMLElement>(`.${STORIES_CLASSES.MUTE_OFF}`, muteButton) ??
      null

    if (muteOnIcon && muteOffIcon) {
      if (useMuted) {
        addClass([muteOnIcon], STORIES_CLASSES.HIDDEN)
        removeClass(muteOffIcon, STORIES_CLASSES.HIDDEN)
        setAttribute(muteButton, ATTRIBUTES.ARIA_LABEL, STORIES_LABELS.MUTE_OFF)
      } else {
        removeClass(muteOnIcon, STORIES_CLASSES.HIDDEN)
        addClass([muteOffIcon], STORIES_CLASSES.HIDDEN)
        setAttribute(muteButton, ATTRIBUTES.ARIA_LABEL, STORIES_LABELS.MUTE_ON)
      }
    }
  }

  private syncMuteControlVisibility(muteButton: HTMLElement): void {
    const currentVideo = this.getCurrentVideo()

    if (!currentVideo) {
      addClass([muteButton], STORIES_CLASSES.HIDDEN)
      return
    }

    if (!this.supportsHoverPauseControl()) {
      if (this.isTouchControlsVisible) removeClass(muteButton, STORIES_CLASSES.HIDDEN)
      else addClass([muteButton], STORIES_CLASSES.HIDDEN)
      return
    }

    if (this.isStoryHovered) removeClass(muteButton, STORIES_CLASSES.HIDDEN)
    else addClass([muteButton], STORIES_CLASSES.HIDDEN)
  }

  private bindMediaStateEvents(storyVideo: HTMLVideoElement | null): void {
    this.clearMediaStateEvents()

    if (!storyVideo) return

    const handleVolumeChange = (): void => {
      this.syncMutedState(storyVideo)
    }

    listener(["volumechange"], storyVideo, handleVolumeChange)
    this.mediaCleanupCallbacks.push(() => {
      removeListener(["volumechange"], storyVideo, handleVolumeChange)
    })
  }

  private clearMediaStateEvents(): void {
    this.mediaCleanupCallbacks.forEach(cleanup => cleanup())
    this.mediaCleanupCallbacks = []
  }

  private isVideoMuted(video: HTMLVideoElement): boolean {
    return video.muted || video.volume === 0
  }

  private togglePause(): void {
    if (this.isPaused) {
      this.resume()
      return
    }

    this.pause()
  }

  private syncPausedState(): void {
    const root = this.getRootSelector
    const pauseIndicator = this.pauseIndicator
    const muteButton = this.muteButton
    const shouldShowPause =
      (this.isStoryHovered && this.supportsHoverPauseControl()) ||
      this.isTouchControlsVisible

    if (!root) return
    if (!pauseIndicator) return

    if (this.isPaused) addClass([root], STORIES_CLASSES.PAUSED)
    else removeClass(root, STORIES_CLASSES.PAUSED)

    if (shouldShowPause) this.showPauseControlElement(pauseIndicator)
    else this.hidePauseControl(pauseIndicator)

    if (muteButton) this.syncMuteControlVisibility(muteButton)

    this.syncPauseControlIcon(pauseIndicator)
  }

  private supportsHoverPauseControl(): boolean {
    if (typeof window === "undefined") return false

    return window.matchMedia("(hover: hover) and (pointer: fine)").matches
  }

  private showPauseControlElement(pauseIndicator: HTMLElement): void {
    removeClass(pauseIndicator, STORIES_CLASSES.HIDDEN)
    addClass([pauseIndicator], "flex")
    removeClass(pauseIndicator, "pointer-events-none")
    removeClass(pauseIndicator, "opacity-0")
    addClass([pauseIndicator], "pointer-events-auto")
    addClass([pauseIndicator], "opacity-100")
    addClass([pauseIndicator], STORIES_CLASSES.CONTROL_VISIBLE)
  }

  private hidePauseControl(pauseIndicator: HTMLElement): void {
    if (!this.supportsHoverPauseControl() && !this.isTouchControlsVisible) {
      addClass([pauseIndicator], STORIES_CLASSES.HIDDEN)
      removeClass(pauseIndicator, "flex")
    }

    removeClass(pauseIndicator, "pointer-events-auto")
    removeClass(pauseIndicator, "opacity-100")
    addClass([pauseIndicator], "pointer-events-none")
    addClass([pauseIndicator], "opacity-0")
    removeClass(pauseIndicator, STORIES_CLASSES.CONTROL_VISIBLE)
  }

  private syncPauseControlIcon(pauseIndicator: HTMLElement): void {
    const pauseIcon = this.getPauseIcon(pauseIndicator)
    const playIcon = this.getPlayIcon(pauseIndicator)

    if (!pauseIcon && !playIcon) {
      pauseIndicator.innerHTML = this.isPaused
        ? STORIES_ICONS.PLAY
        : STORIES_ICONS.PAUSE
      return
    }

    this.syncIconVisibility(pauseIcon, !this.isPaused)
    this.syncIconVisibility(playIcon, this.isPaused)
  }

  private syncIconVisibility(
    icon: HTMLElement | null,
    shouldShow: boolean
  ): void {
    if (!icon) return

    if (shouldShow) removeClass(icon, STORIES_CLASSES.HIDDEN)
    else addClass([icon], STORIES_CLASSES.HIDDEN)
  }

  private getPauseIcon(parent: HTMLElement): HTMLElement | null {
    return getElement<HTMLElement>(`.${STORIES_CLASSES.PAUSE}`, parent) ?? null
  }

  private getPlayIcon(parent: HTMLElement): HTMLElement | null {
    return getElement<HTMLElement>(`.${STORIES_CLASSES.PLAY}`, parent) ?? null
  }

  private getControlFromEvent(event: Event): string | null {
    const target = event.target instanceof Element ? event.target : null
    const pointTarget = this.getPointTargetFromEvent(event)
    const path = event.composedPath()
    const controlClasses = [STORIES_CLASSES.CLOSE]
    const closestControl = controlClasses.find(className =>
      closestElement(target as Element | null, `.${className}`)
    )

    if (closestControl) return closestControl

    const pointControl = controlClasses.find(className =>
      closestElement(pointTarget, `.${className}`)
    )

    if (pointControl) return pointControl

    for (const target of path) {
      if (!(target instanceof Element)) continue

      const controlClass = controlClasses.find(className =>
        hasClass(target as HTMLElement, className)
      )

      if (controlClass) return controlClass
    }

    return null
  }

  private getPointTargetFromEvent(event: Event): Element | null {
    const pointerEvent = event as MouseEvent | TouchEvent
    const touchEvent = event as TouchEvent
    const touch = touchEvent.touches?.[0] ?? touchEvent.changedTouches?.[0]
    const clientX = touch?.clientX ?? (pointerEvent as MouseEvent).clientX
    const clientY = touch?.clientY ?? (pointerEvent as MouseEvent).clientY

    if (!Number.isFinite(clientX)) return null
    if (!Number.isFinite(clientY)) return null

    return document.elementFromPoint(clientX, clientY)
  }

  private isPointerInsideStoryRect(event: MouseEvent): boolean {
    const track = this.getStoriesTrack()
    const pauseIndicator = this.pauseIndicator
    const rect = track?.getBoundingClientRect()
    const pauseRect = pauseIndicator?.getBoundingClientRect()

    if (!rect) return false

    return (
      this.isPointInsideRect(event, rect) ||
      this.isPointInsideOptionalRect(event, pauseRect)
    )
  }

  private isPointInsideOptionalRect(
    event: MouseEvent,
    rect?: DOMRect
  ): boolean {
    if (!rect) return false

    return this.isPointInsideRect(event, rect)
  }

  private isPointInsideRect(event: MouseEvent, rect: DOMRect): boolean {
    return (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    )
  }

  private isPointerInsideStoryControlArea(): boolean {
    const track = this.getStoriesTrack()
    const pauseIndicator = this.pauseIndicator
    const isInsidePauseButton = pauseIndicator?.matches(":hover") ?? false

    if (!track) return false

    return track.matches(":hover") || isInsidePauseButton
  }

  private isStoryHoverBlockedByControl(event: Event): boolean {
    const target = event.target instanceof Element ? event.target : null
    const pointTarget = this.getPointTargetFromEvent(event)
    const blockedControlClasses = [STORIES_CLASSES.CLOSE]

    return blockedControlClasses.some(
      className =>
        closestElement(target, `.${className}`) ||
        closestElement(pointTarget, `.${className}`)
    )
  }

  private showTouchControlsTemporarily(): void {
    if (this.supportsHoverPauseControl()) return

    this.isTouchControlsVisible = true
    this.clearMobileControlsTimer()
    this.syncPausedState()
  }

  private scheduleTouchControlsHide(): void {
    if (this.supportsHoverPauseControl()) return

    this.clearMobileControlsTimer()
    this.mobileControlsTimer = window.setTimeout(() => {
      this.isTouchControlsVisible = false
      this.syncPausedState()
    }, 1800)
  }

  private clearMobileControlsTimer(): void {
    if (this.mobileControlsTimer === null) return

    window.clearTimeout(this.mobileControlsTimer)
    this.mobileControlsTimer = null
  }

  private isInteractiveStoryControlTarget(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) return false

    return Boolean(
      closestElement(target, `.${STORIES_CLASSES.CLOSE}`) ||
        closestElement(target, `.${STORIES_CLASSES.MUTE}`) ||
        closestElement(target, `.${STORIES_CLASSES.PAUSE_INDICATOR}`) ||
        closestElement(target, `.${STORIES_CLASSES.PROGRESS}`)
    )
  }

  private getStoriesTrack(): HTMLElement | null {
    return getTrackChildren(this.$root) ?? null
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

  private getStoryVideos(index: number): HTMLVideoElement[] {
    const slides = getSliderNodeList(this.$root, false)
    const slide = slides[index]

    return slide
      ? Array.from(getAllElements<HTMLVideoElement>(TAGS.VIDEO, slide))
      : []
  }

  private getPlayableStoryVideo(index: number): HTMLVideoElement | null {
    const storyVideos = this.getStoryVideos(index)
    const storyVideo = storyVideos[0] ?? null

    this.warnMultipleVideos(index, storyVideos)

    return storyVideo
  }

  private syncMultipleVideoControls(index: number): void {
    const storyVideos = this.getStoryVideos(index)

    storyVideos.forEach((video, videoIndex) => {
      video.controls = videoIndex > 0
    })
  }

  private warnMultipleVideos(
    index: number,
    storyVideos: HTMLVideoElement[]
  ): void {
    const storyNumber = index + 1
    const hasMultipleVideos = storyVideos.length > 1
    const alreadyWarned = this.warnedMultipleVideoStories.has(index)

    if (!hasMultipleVideos) return
    if (alreadyWarned) return

    this.warnedMultipleVideoStories.add(index)
    console.warn(
      `[BrickSlider Stories] Story ${storyNumber} contains more than one video. Only the first video controls duration, mute and playback.`
    )
  }

  private getCurrentVideo(): HTMLVideoElement | null {
    return this.getPlayableStoryVideo(this.getCurrentStoryIndex())
  }

  private pauseCurrentVideo(): void {
    this.getCurrentVideo()?.pause()
  }

  private playCurrentVideo(): void {
    this.getCurrentVideo()
      ?.play()
      .catch(() => undefined)
  }

  private pauseAllVideos(): void {
    const root = this.getRootSelector
    const videos = root
      ? getAllElements<HTMLVideoElement>(TAGS.VIDEO, root)
      : []

    videos.forEach(video => video.pause())
  }

  private hasVideos(): boolean {
    const root = this.getRootSelector
    const videos = root
      ? getAllElements<HTMLVideoElement>(TAGS.VIDEO, root)
      : []

    return videos.length > 0
  }

  private hasVideoAudio(video: HTMLVideoElement): boolean {
    const audioVideo = video as HTMLVideoElement & {
      audioTracks?: { length: number }
      mozHasAudio?: boolean
      webkitAudioDecodedByteCount?: number
    }

    if (audioVideo.audioTracks) return audioVideo.audioTracks.length > 0
    if (typeof audioVideo.mozHasAudio === "boolean")
      return audioVideo.mozHasAudio
    if (
      typeof audioVideo.webkitAudioDecodedByteCount === "number" &&
      audioVideo.webkitAudioDecodedByteCount > 0
    )
      return true

    return true
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
    this.clearMediaStateEvents()
    this.clearControlEvents()
    this.unbindTrackHoverEvents()
    this.removeCreatedElement(this.closeButton)
    this.removeCreatedElement(this.muteButton)
    this.removeCreatedElement(this.pauseIndicator)
    this.closeButton = null
    this.muteButton = null
    this.pauseIndicator = null
    this.removeCreatedElement(this.storiesLayer)
    this.storiesLayer = null
  }

  private clearControlEvents(): void {
    this.controlCleanupCallbacks.forEach(cleanup => cleanup())
    this.controlCleanupCallbacks = []
  }

  private unbindTrackHoverEvents(): void {
    const track = this.getStoriesTrack()

    if (!track) return

    removeListener([EVENTS.MOUSEENTER], track, this.handleMouseEnter)
    removeListener([EVENTS.MOUSEMOVE], track, this.handleMouseMove)
    removeListener([EVENTS.MOUSELEAVE], track, this.handleMouseLeave)
    removeListener([EVENTS.POINTERDOWN], track, this.handleStoryPointerDown)
    removeListener(
      [EVENTS.POINTERUP, EVENTS.POINTERCANCEL],
      track,
      this.handleStoryPointerUp
    )
  }

  private destroyProgress(): void {
    this.progressCleanupCallbacks.forEach(cleanup => cleanup())
    this.progressCleanupCallbacks = []
    this.progressBars.forEach(progressBar => {
      this.removeCreatedElement(progressBar.parentElement as HTMLElement)
      this.removeCreatedElement(progressBar)
    })
    this.removeCreatedElement(this.progressContainer)
    this.progressContainer = null
    this.progressBars = []
  }

  private removeCreatedElement(element: HTMLElement | null): void {
    if (!element) return
    if (!this.createdElements.has(element)) return

    removeElement(element)
    this.createdElements.delete(element)
  }

  private destroyEdgeSwipeLock(): void {
    const root = this.getRootSelector

    if (!root) return

    removeListener([EVENTS.MOUSEDOWN], root, this.handleStoryMouseDown, true)
    removeListener([EVENTS.MOUSEMOVE], root, this.handleStoryMouseMove, true)
    removeListener(
      [EVENTS.MOUSEUP, EVENTS.MOUSELEAVE],
      root,
      this.handleStoryPointerEnd
    )
    removeListener([EVENTS.TOUCHSTART], root, this.handleStoryTouchStart, true)
    removeListener([EVENTS.TOUCHMOVE], root, this.handleStoryTouchMove, true)
    removeListener([EVENTS.TOUCHEND], root, this.handleStoryPointerEnd)
  }

  private createProgressContainer(): HTMLElement {
    const progressContainer = createNewElement(TAGS.DIV)

    addClass([progressContainer], STORIES_CLASSES.PROGRESS)
    this.createdElements.add(progressContainer)

    return progressContainer
  }

  private createProgressBars(
    storyCount: number,
    progressTemplate: HTMLElement | null
  ): HTMLElement[] {
    return Array.from({ length: storyCount }, () => {
      return this.createProgressItem(progressTemplate)
    })
  }

  private getProgressItemTemplate(
    progressContainer: HTMLElement
  ): HTMLElement | null {
    return (
      getElement<HTMLElement>(
        `.${STORIES_CLASSES.PROGRESS_ITEM}`,
        progressContainer
      ) ?? null
    )
  }

  private createProgressItem(progressTemplate: HTMLElement | null): HTMLElement {
    const progressItem = this.cloneProgressItem(progressTemplate)
    const progressBar = this.prepareProgressItem(progressItem)

    this.createdElements.add(progressItem)
    this.createdElements.add(progressBar)

    return progressBar
  }

  private cloneProgressItem(progressTemplate: HTMLElement | null): HTMLElement {
    if (progressTemplate) return progressTemplate.cloneNode(true) as HTMLElement

    return createNewElement(TAGS.BUTTON)
  }

  private prepareProgressItem(progressItem: HTMLElement): HTMLElement {
    const existingProgressBar =
      getElement<HTMLElement>(
        `.${STORIES_CLASSES.PROGRESS_BAR}`,
        progressItem
      ) ?? null
    const progressBar = existingProgressBar ?? createNewElement(TAGS.DIV)

    addClass([progressItem], STORIES_CLASSES.PROGRESS_ITEM)
    addClass([progressBar], STORIES_CLASSES.PROGRESS_BAR)
    if (!existingProgressBar) appendToParent(progressItem, progressBar)

    return progressBar
  }

  private createPauseControl(): HTMLElement {
    const button = this.createControlButton(
      STORIES_CLASSES.PAUSE_INDICATOR,
      STORIES_LABELS.PAUSE,
      ""
    )
    const pauseIcon = createNewElement(TAGS.SPAN)
    const playIcon = createNewElement(TAGS.SPAN)

    addClass([pauseIcon], STORIES_CLASSES.PAUSE)
    addClass([playIcon], STORIES_CLASSES.PLAY)
    addClass([playIcon], STORIES_CLASSES.HIDDEN)
    pauseIcon.innerHTML = STORIES_ICONS.PAUSE
    playIcon.innerHTML = STORIES_ICONS.PLAY
    appendToParent(button, pauseIcon)
    appendToParent(button, playIcon)

    return button
  }

  private createMuteControl(): HTMLElement {
    const button = this.createControlButton(
      STORIES_CLASSES.MUTE,
      STORIES_LABELS.MUTE_ON,
      ""
    )
    const muteOnIcon = createNewElement(TAGS.SPAN)
    const muteOffIcon = createNewElement(TAGS.SPAN)

    addClass([muteOnIcon], STORIES_CLASSES.MUTE_ON)
    addClass([muteOffIcon], STORIES_CLASSES.MUTE_OFF)
    addClass([muteOffIcon], STORIES_CLASSES.HIDDEN)
    muteOnIcon.innerHTML = STORIES_ICONS.MUTE_ON
    muteOffIcon.innerHTML = STORIES_ICONS.MUTE_OFF
    appendToParent(button, muteOnIcon)
    appendToParent(button, muteOffIcon)

    return button
  }

  private createControlButton(
    className: string,
    label: string,
    content: string
  ): HTMLElement {
    const button = createNewElement(TAGS.BUTTON)

    addClass([button], className)
    this.prepareControlButton(button, label)
    button.innerHTML = content
    this.createdElements.add(button)

    return button
  }

  private prepareControlButton(
    button: HTMLElement | null,
    label: string
  ): void {
    if (!button) return

    setAttribute(button, ATTRIBUTES.TYPE, TAGS.BUTTON)
    setAttribute(button, ATTRIBUTES.ARIA_LABEL, label)
  }

  private getStoriesElement(className: string): HTMLElement | null {
    const root = this.getRootSelector
    const scopedElement = root
      ? (getElement<HTMLElement>(`.${className}`, root) ?? null)
      : null
    const globalElement = $(`.${className}`) as HTMLElement | null

    return scopedElement ?? globalElement
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
      closeOnEnd: options.closeOnEnd ?? STORIES_DEFAULTS.CLOSE_ON_END,
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
}

export { BrickSliderStories as BSStoriesPlugin }
