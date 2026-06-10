export type BrickSliderAccessibilitySlideChangePayload = {
    slideIndex?: number;
    activePage?: number;
};
export type SlideChangePayload = BrickSliderAccessibilitySlideChangePayload;
export type SyncAccessibilityParams = {
    announce?: boolean;
};
export type BrickSliderAccessibilityLabels = Partial<{
    root: string;
    pagination: string;
    previousSlide: string;
    nextSlide: string;
    slide: (slideNumber: number, totalSlides: number) => string;
    page: (pageNumber: number) => string;
    liveRegionSingle: (slideNumber: number, totalSlides: number) => string;
    liveRegionRange: (firstSlideNumber: number, lastSlideNumber: number, totalSlides: number) => string;
    liveRegionFallback: (totalSlides: number) => string;
}>;
export type AccessibilityLabels = BrickSliderAccessibilityLabels;
export type BrickSliderAccessibilityOptions = Partial<{
    useKeyboardNavigation: boolean;
    useFocusManagement: boolean;
    labels: BrickSliderAccessibilityLabels;
}>;
export type ResolvedBrickSliderAccessibilityLabels = {
    root: string;
    pagination: string;
    previousSlide: string;
    nextSlide: string;
    slide: (slideNumber: number, totalSlides: number) => string;
    page: (pageNumber: number) => string;
    liveRegionSingle: (slideNumber: number, totalSlides: number) => string;
    liveRegionRange: (firstSlideNumber: number, lastSlideNumber: number, totalSlides: number) => string;
    liveRegionFallback: (totalSlides: number) => string;
};
export type ResolvedAccessibilityLabels = ResolvedBrickSliderAccessibilityLabels;
export type ResolvedBrickSliderAccessibilityOptions = {
    useKeyboardNavigation: boolean;
    useFocusManagement: boolean;
    labels: ResolvedBrickSliderAccessibilityLabels;
};
