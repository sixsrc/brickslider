import { BaseSlider } from './BaseSlider';
import { StateType, MouseEventOrTouchEvent } from './types';
export declare class TouchStart extends BaseSlider {
    private draggable;
    constructor($root: string);
    init(event: MouseEventOrTouchEvent): void;
    private handleEvents;
    protected mainState(event: TouchEvent | MouseEvent): Partial<StateType>;
}
