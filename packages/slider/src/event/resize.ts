import { getSliderWidth } from "../dom/methods/getSliderWidth";
import { transform as setTransformSlider } from "../transition/transform";
import { State, State_Keys } from "../state/BrickState";
import { getChildren } from "../core/functions/getChildren";

export function resize(rootSelector: string): void {
  const sliderWidth = getSliderWidth(getChildren(rootSelector)),
    state = new State(rootSelector);
  state.set(State_Keys.SliderWidth, sliderWidth);
  setTransformSlider(rootSelector);
}
