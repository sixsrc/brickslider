import { State, State_Keys } from "@/state/BrickState"

export function isLoop(state: State, func: () => void): void {
  if (state.get(State_Keys.Infinite)) func()
}
