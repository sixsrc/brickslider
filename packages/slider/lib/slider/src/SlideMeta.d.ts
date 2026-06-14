import { BaseSlider } from './BaseSlider';
export declare class SlideMeta extends BaseSlider {
    private static readonly metaMap;
    private static readonly defaultValue;
    constructor($root: string);
    private toSafeInteger;
    private getStoredMeta;
    private getAttributeInteger;
    hasSlideMeta(slide: HTMLElement | undefined): boolean;
    setSlideMeta(slide: HTMLElement, dataIndex: number, slideNumber: number, isCloned?: boolean): void;
    syncSlideDataIndex(slide: HTMLElement, dataIndex: number): void;
    syncSlideNumber(slide: HTMLElement, slideNumber: number): void;
    getSlideDataIndex(slide: HTMLElement | undefined): number;
    getSlideNumber(slide: HTMLElement | undefined): number;
    getSlideRealIndex(slide: HTMLElement | undefined): number;
    restoreSlideDataIndexAttribute(slide: HTMLElement | undefined): void;
    getIsClonedSlide(slide: HTMLElement | undefined): boolean;
}
