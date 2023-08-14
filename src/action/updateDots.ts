import { CLASS_VALUES, TAGS } from "../util/constants";
import { getAllElements } from "../dom/methods/getAllElements";
import { hasClass } from "../dom/methods/hasClass";
import { removeClass } from "../dom/methods/removeClass";
import { addClass } from "../dom/methods/addClass";
import { State, State_Keys } from "../state/BrickState";
import { getDotsSelector } from "../core/functions/getDotsSelector";

export function updateDots(
  index: number | undefined,
  rootSelector: string
): void {
  const dots = getAllElements<HTMLElement>(
      TAGS.LI,
      getDotsSelector(rootSelector)
    ),
    selectedIndex = index ?? 0,
    state = new State(rootSelector);

  dots.forEach((dot, i) => {
    if (hasClass(dot, CLASS_VALUES.SELECTED)) {
      removeClass(dot, CLASS_VALUES.SELECTED);
      state.set(State_Keys.SlideIndex, selectedIndex);
    }
    if (i === selectedIndex) addClass([dot], CLASS_VALUES.SELECTED);
  });
}
