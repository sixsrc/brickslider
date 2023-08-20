import { FROM, setCurrentSlide } from "../../action/setCurrentSlide";
import { updateDots } from "../../action/updateDots";
import { State, State_Keys } from "../../state/BrickState";

export const updateSliderFromDots = (rootSelector: string): void => {
  const state = new State(rootSelector),
    index = state.get(State_Keys.SlideIndex);

  updateDots(index, rootSelector);

  setCurrentSlide({
    from: FROM.DOTS,
    index,
    rootSelector,
  });
};
