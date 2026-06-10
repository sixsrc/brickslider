import { Validation } from './Validation';
export declare class Messages extends Validation {
    private readonly messageMap;
    private readonly levelMap;
    private readonly rootSelector;
    constructor($root: string);
    private static textMessages;
    private static textLevels;
    displayMessage(): void;
    private getMessageById;
}
