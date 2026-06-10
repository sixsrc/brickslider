import { BaseSlider } from './BaseSlider';
import { AnimationCallbacks, AnimationOptions, KeyframeAnimation } from './types';
export declare class AnimationFrame extends BaseSlider {
    constructor($root: string);
    init: (callbacks?: AnimationCallbacks) => Promise<Animation[]>;
    protected keyFrames(): KeyframeAnimation[];
    protected options(time?: number): AnimationOptions;
}
