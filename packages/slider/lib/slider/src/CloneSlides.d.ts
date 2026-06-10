import { BaseSlider } from './BaseSlider';
export declare class CloneSlides extends BaseSlider {
    protected slides: HTMLElement[];
    private clonedSlides;
    private mount;
    private dataIndex;
    private totalWidthBefore;
    private slidesBefore;
    private slider;
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
    protected calcTranslate(): number;
    private checkDataIndex;
    private setTotalWidth;
    private setTranslate;
}
