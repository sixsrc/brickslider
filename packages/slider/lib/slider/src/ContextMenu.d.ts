import { BaseSlider } from './BaseSlider';
export declare class ContextMenu extends BaseSlider {
    constructor($root: string);
    init(): void;
    private rightClick;
    private contextMenuState;
    private params;
    private setContextListener;
}
