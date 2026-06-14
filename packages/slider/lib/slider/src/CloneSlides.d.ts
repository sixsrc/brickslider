import { BaseSlider } from './BaseSlider';
export declare class CloneSlides extends BaseSlider {
    protected slides: HTMLElement[];
    private clonedSlides;
    private mount;
    private slider;
    private slideMeta;
    constructor($root: string);
    init(): void;
    private duplicateSlides;
    private getCloneQuantity;
    private getMaxResponsiveSlideCount;
    private getResponsiveCloneCount;
    private loopByClonedSlides;
    private slidePositionState;
    private mountClonedSlides;
    private mountStartClone;
    private mountEndClone;
    private createClonedSlide;
    private syncCloneDataIndex;
    private syncSlideNumbers;
    private getMountedSlides;
    private getInitialSlideIndex;
    private getInitialIndex;
    private getInitialTranslate;
    private setTranslate;
}
