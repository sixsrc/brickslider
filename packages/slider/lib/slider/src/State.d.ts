import { SliderOptions, StateType } from './types';
export declare enum StateKey {
    PrevSlideIndex = "prevSlideIndex",
    SlideIndex = "slideIndex",
    ActivePage = "activePage",
    ActiveDataIndex = "activeDataIndex",
    SlideGap = "gap",
    SlidesPerPage = "slidesPerPage",
    SlidesPerView = "slidesPerView",
    BaseSlidesPerPage = "baseSlidesPerPage",
    BaseSlidesPerView = "baseSlidesPerView",
    NumberOfPages = "numberOfPages",
    NumberOfSlides = "numberOfSlides",
    SliderWidth = "sliderWidth",
    SlideSizes = "slideSizes",
    BaseSlideSizes = "baseSlideSizes",
    Screens = "screens",
    Responsive = "responsive",
    ActiveBreakpoint = "activeBreakpoint",
    StartX = "startX",
    StartY = "startY",
    EndX = "endX",
    IsPagedActive = "isPagedActive",
    IsInitialRender = "isInitialRender",
    IsTouch = "isTouch",
    IsCompleteGroup = "isCompleteGroup",
    IsDragging = "isDragging",
    IsJumpSlide = "isJumpSlide",
    IsFastNavigation = "isFastNavigation",
    StartPos = "startPos",
    PrevTranslate = "prevTranslate",
    CurrentTranslate = "currentTranslate",
    CurrentEventType = "currentEventType",
    CurrentSlideMovement = "currentSlideMovement",
    StartTime = "startTime",
    EndTime = "endTime",
    IsMouseLeave = "isMouseLeave",
    AnimationID = "animationID",
    Dots = "dots",
    DotIndex = "dotIndex",
    Arrows = "arrows",
    Touch = "touch",
    UseLoop = "useLoop",
    UseDragFree = "useDragFree",
    UseAutoHeight = "useAutoHeight",
    NavigationLockUntil = "navigationLockUntil"
}
declare class State {
    private static state;
    key: string;
    constructor(key: string, options?: Partial<SliderOptions>);
    private initializeState;
    private hasDotsMarkup;
    private hasArrowsMarkup;
    private normalizeSlideSizes;
    private isValidSlideSizePosition;
    private hasSlideSize;
    private formatSlideSize;
    private normalizeResponsive;
    private normalizeScreens;
    private isResponsiveBreakpoint;
    private getResponsiveNumber;
    setOptions(options: SliderOptions): void;
    static store<K extends keyof StateType>(key: K): StateType;
    private invalidationConditions;
    private shouldInvalidateKey;
    set(props: {
        [key in keyof StateType]?: StateType[key];
    }): void;
}
export { State };
