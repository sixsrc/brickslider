import { BaseSlider } from './BaseSlider';
export declare class Swipe extends BaseSlider {
    private touchStart;
    private touchEnd;
    private touchMove;
    constructor($root: string);
    init(): void;
    private params;
    private setListeners;
}
