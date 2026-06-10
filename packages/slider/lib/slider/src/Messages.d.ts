import { Validation } from './Validation';
export declare class Messages extends Validation {
    private messageMap;
    private levelMap;
    private rootSelector;
    constructor($root: string);
    static TextMessages($root: string): Record<string, string>;
    static TextLevels(): Record<string, "warn" | "error">;
    displayMessage(options?: Parameters<Validation["sanitizeOptions"]>[0]): void;
    displayWarning(message: string): void;
    displayError(message: string): void;
    displayInvalidGoToIndex(index: number): void;
    displayDragFreeGoToIgnored(): void;
    displayInvalidPluginType(): void;
    displayPluginRootMismatch(pluginName: string): void;
    private getMessageById;
}
