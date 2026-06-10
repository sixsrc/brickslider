import { BaseSlider } from './BaseSlider';
import { BrickSlider } from './BrickSlider';
export declare class Plugin extends BaseSlider {
    protected host: BrickSlider | null;
    private readonly hasConfiguredRoot;
    constructor($root?: string);
    init(): void;
    destroy(): void;
    setHost(host: BrickSlider): void;
    getPluginRoot(): string;
    usesExplicitRoot(): boolean;
}
