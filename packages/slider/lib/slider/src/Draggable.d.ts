import { BaseSlider } from './BaseSlider';
export declare class Draggable extends BaseSlider {
    constructor($root: string);
    init(): void;
    private params;
    private setDragListeners;
    private dragStart;
    private handleMove;
    private handleEnd;
    private axisState;
    private draggingState;
}
