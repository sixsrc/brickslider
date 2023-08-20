import { FROM, setCurrentSlide } from "../../action/setCurrentSlide";
import { updateDots } from "../../action/updateDots";
import { getRootSelector } from "../../core/functions/getRootSelector";
import { getSliderWidth } from "../../dom/methods/getSliderWidth";
import { State, State_Keys } from "../../state/BrickState";
import { matchStateOptions } from "../../util/matchStateOptions";

export class SetPositionByIndex {
  state: State;
  rootSelector: string;
  slider: any;

  constructor(rootSelector: string) {
    this.state = new State(rootSelector);
    this.rootSelector = rootSelector;
    this.slider = getRootSelector(this.rootSelector);
  }

  init(): void {
    const { state, rootSelector, slider } = this;

    const [sliderWidth, currentIndex] = [
      getSliderWidth(slider),
      state.get(State_Keys.SlideIndex),
    ];

    // state.set(State_Keys.currentTranslate, currentIndex * -sliderWidth);

    // state.set(State_Keys.prevTranslate, currentIndex * -sliderWidth);

    const currentTranslate = currentIndex * -sliderWidth;

    state.setMultipleState({
      [State_Keys.currentTranslate]: currentTranslate,
      [State_Keys.prevTranslate]: currentTranslate,
    });

    const [index, from] = [currentIndex, FROM.TOUCH];

    setCurrentSlide({
      from,
      index,
      rootSelector,
    });

    const setActiveDot = () => {
      updateDots(index, rootSelector);
    };

    matchStateOptions(rootSelector, { [State_Keys.Dots]: true }, setActiveDot);
  }
}
