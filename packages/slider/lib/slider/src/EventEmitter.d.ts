import { Listener } from './types';
export declare class EventEmitter {
    private listeners;
    on(event: string, listener: Listener): void;
    off(event: string, listener: Listener): void;
    emit(event: string, ...args: unknown[]): void;
}
