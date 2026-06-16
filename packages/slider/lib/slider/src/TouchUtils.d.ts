import { MouseEventOrTouchEvent } from './types';
export declare const TOUCH_LIMIT = 0;
export declare const MOVE_TO_LIMIT = 3;
export declare const TOUCH_CONFIG: {
    readonly FAST_SWIPE_MAX_MS: 180;
    readonly FAST_VELOCITY_THRESHOLD: 0.35;
    readonly SLOW_LIMIT: 35;
    readonly MAX_LIMIT: 55;
    readonly DRAG_FREE_SETTLE_FACTOR: 0.12;
};
export declare const POSITION: {
    readonly RIGHT: "right";
    readonly LEFT: "left";
};
export declare function isPrimaryInputButton(event: MouseEventOrTouchEvent): boolean;
export declare function getAxisX(event: MouseEventOrTouchEvent): number;
