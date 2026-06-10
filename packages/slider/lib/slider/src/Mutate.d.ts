import { BaseSlider } from './BaseSlider';
export declare class Mutate extends BaseSlider {
    constructor($root: string);
    private getAllSlides;
    updateActiveSlides(visibleIndexes: number[] | null, maxActive?: number): void;
    private syncActiveSlides;
    private getActiveIndexes;
    private applyActiveSlides;
    private toggleActiveSlide;
    private resetActiveClasses;
}
