import { getRootSelector } from "../../core/functions/getRootSelector";
import { getAllElements } from "../../dom/methods/getAllElements";
import { State, State_Keys } from "../../state/BrickState";
import { shouldGoToNextSlide } from "./functions/shouldGoToNextSlide";
import { shouldGoToPrevSlide } from "./functions/shouldGoToPrevSlide";
import { SetPositionByIndex } from "./SetPositionByIndex";

export class TouchEnd {
  state: State;
  slides: HTMLElement[];
  slider: any;
  rootSelector: string;
  setPositionByIndex: SetPositionByIndex;

  constructor(rootSelector: string) {
    this.state = new State(rootSelector);
    this.slider = getRootSelector(rootSelector);
    this.slides = Array.from(
      getAllElements<HTMLElement>(".slider__container div", this.slider)
    );
    this.setPositionByIndex = new SetPositionByIndex(rootSelector);
    this.rootSelector = rootSelector;
  }
  public init = (): void => {
    const { state, slides, slider, setPositionByIndex } = this;

    state.set(State_Keys.isDragging, false);

    slider.oncontextmenu = null;

    cancelAnimationFrame(state.get(State_Keys.animationID));

    const moveSlider =
      state.get(State_Keys.currentTranslate) -
      state.get(State_Keys.prevTranslate);

    let currentIndex = state.get(State_Keys.SlideIndex);

    if (shouldGoToNextSlide(moveSlider, currentIndex, slides))
      state.set(State_Keys.SlideIndex, (currentIndex += 1));

    if (shouldGoToPrevSlide(moveSlider, currentIndex))
      state.set(State_Keys.SlideIndex, (currentIndex -= 1));

    setPositionByIndex.init();
  };
}
