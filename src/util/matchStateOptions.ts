/*import { State as BrickState } from "../state/BrickState";

type OptionsToCheck = Record<string, any>;
type Callback = () => void;

export function matchStateOptions(
  rootSelector: string,
  optionsToCheck: OptionsToCheck,
  callback: Callback
): void {
  if (optionsToCheck) {
    new BrickState(rootSelector);
    for (const [key, value] of Object.entries(optionsToCheck)) {
      if (BrickState.state[rootSelector][key] === value) {
        callback();
      }
    }
  }
}*/

import { State as BrickState } from "../state/BrickState";

type OptionsToCheck = Record<string, any>;
type Callback = () => void;

export function matchStateOptions(
  rootSelector: string,
  optionsToCheck: OptionsToCheck,
  callback?: Callback
): boolean {
  if (optionsToCheck) {
    new BrickState(rootSelector);
    for (const [key, value] of Object.entries(optionsToCheck)) {
      if (BrickState.state[rootSelector][key] !== value) {
        return false;
      }
    }
    if (callback) {
      callback();
    }
    return true;
  }
  return false;
}
