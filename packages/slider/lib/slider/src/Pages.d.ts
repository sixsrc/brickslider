import { BaseSlider } from './BaseSlider';
export declare class Pages extends BaseSlider {
    private containerPages;
    constructor($root: string);
    init(): void;
    sync(): void;
    private getPagesLabel;
    private getSafePagesCount;
    private getSafeCurrentPage;
}
