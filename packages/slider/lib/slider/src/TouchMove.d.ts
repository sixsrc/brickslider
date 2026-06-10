import { BaseSlider } from './BaseSlider';
import { MouseEventOrTouchEvent, PositionSlider } from './types';
export declare class TouchMove extends BaseSlider {
    private currentPosition;
    protected previousPosition: number;
    private skipSlide;
    private currentIndex;
    protected translate: number;
    private animation;
    constructor($root: string);
    init(event: MouseEventOrTouchEvent): void;
    protected updatePosition(event: MouseEvent | TouchEvent): void;
    private eventTargetState;
    private infiniteState;
    private mainState;
    protected movingTo(position: PositionSlider): boolean;
}
