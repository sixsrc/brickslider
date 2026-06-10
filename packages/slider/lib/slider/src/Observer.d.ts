import { BaseSlider } from './BaseSlider';
export declare class Observer extends BaseSlider {
    private visibleIndexes;
    private visibleDataIndexes;
    private elementToIndexMap;
    private animationFrameId;
    private lastIndex;
    constructor($root: string);
    private observeSlides;
    private startObserving;
    private checkVisibleSlides;
    private getVisibleSlides;
    private isSlideVisible;
    private getSlideVisibleRatio;
    private getVisibleIndexes;
    private getVisibleDataIndexSet;
    private getSlideNumber;
    private getSlideIndex;
    private hasVisibleSlidesChanged;
    private updateVisibleSlides;
    private setsDiffer;
    protected updateLastIndex(): void;
    private setActiveDataIndexState;
    getVisibleSlideIndexes(): number[];
    getVisibleDataIndexes(): number[];
    getLastVisibleDataIndex(): number;
    destroy(): void;
}
