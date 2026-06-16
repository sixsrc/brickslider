import { Validation } from './Validation';
export declare class Messages extends Validation {
    private readonly rootSelector;
    constructor($root: string);
    displayMessage(options?: Parameters<Validation["sanitizeOptions"]>[0]): void;
    displayWarning(message: string): void;
    displayError(message: string): void;
    displayInvalidGoToIndex(index: number): void;
    displayDragFreeGoToIgnored(): void;
    displayInvalidPluginType(): void;
    displayPluginRootMismatch(pluginName: string): void;
    private getMessageById;
}
