import { BaseSlider } from './BaseSlider';
import { AnimationCallbacks, AnimationOptions, KeyframeAnimation } from './types';
export declare class AnimationFrame extends BaseSlider {
    constructor($root: string);
    init: (callbacks?: AnimationCallbacks) => Promise<Animation[]>;
    private animateTrack;
    private syncProgress;
    private runStartCallback;
    private resolveWhenFinished;
    protected keyFrames(): KeyframeAnimation[];
    protected options(time?: number): AnimationOptions;
    private getAnimationDuration;
    private getAnimationEasing;
    private isTouchMove;
    private isDragFreeRelease;
    private normalizeDuration;
    private getPagedDuration;
}
