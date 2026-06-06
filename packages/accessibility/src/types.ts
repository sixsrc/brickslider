export type SlideChangePayload = {
  slideIndex?: number
  activePage?: number
}

export type SyncAccessibilityParams = {
  announce?: boolean
}

export type AccessibilityLabels = Partial<{
  root: string
  pagination: string
  previousSlide: string
  nextSlide: string
  slide: (slideNumber: number, totalSlides: number) => string
  page: (pageNumber: number) => string
  liveRegionSingle: (slideNumber: number, totalSlides: number) => string
  liveRegionRange: (
    firstSlideNumber: number,
    lastSlideNumber: number,
    totalSlides: number
  ) => string
  liveRegionFallback: (totalSlides: number) => string
}>

export type BSAccessibilityPluginOptions = Partial<{
  useKeyboardNavigation: boolean
  useFocusManagement: boolean
  labels: AccessibilityLabels
}>

export type ResolvedAccessibilityLabels = {
  root: string
  pagination: string
  previousSlide: string
  nextSlide: string
  slide: (slideNumber: number, totalSlides: number) => string
  page: (pageNumber: number) => string
  liveRegionSingle: (slideNumber: number, totalSlides: number) => string
  liveRegionRange: (
    firstSlideNumber: number,
    lastSlideNumber: number,
    totalSlides: number
  ) => string
  liveRegionFallback: (totalSlides: number) => string
}

export type ResolvedBSAccessibilityPluginOptions = {
  useKeyboardNavigation: boolean
  useFocusManagement: boolean
  labels: ResolvedAccessibilityLabels
}
