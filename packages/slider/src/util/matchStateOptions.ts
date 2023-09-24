import { State as BrickState } from "../state/BrickState"

type OptionsToCheck = Record<string, unknown>
type Callback = () => void

export function matchStateOptions(
  $root: string,
  optionsToCheck: OptionsToCheck,
  callback?: Callback
): boolean {
  if (optionsToCheck) {
    new BrickState($root)
    for (const [key, value] of Object.entries(optionsToCheck)) {
      if (BrickState.state[$root][key] !== value) return false
    }
    if (callback) callback()
    return true
  }
  return false
}
