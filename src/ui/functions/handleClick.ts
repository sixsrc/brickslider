import { getElementAttribute } from "../../dom/methods/getElementAttribute";
import { ATTRIBUTES, /*TIMES */ 
EVENTS} from "../../util/constants";
import { FROM, setCurrentSlide } from "../../action/setCurrentSlide";
import { updateDots } from "../../action/updateDots";
import { State, State_Keys } from "../../state/BrickState";
import { matchStateOptions } from "../../util/matchStateOptions";
import { listener } from "../../util";
import { getChildren } from "../../core/functions/getChildren";

//let isSliderReady = true;

export function handleClick(button: Element, rootSelector: string): () => void {
  return () => {
    const state = new State(rootSelector);
   
    if (!state.get(State_Keys.SliderReady)) return;

    //isSliderReady = false; 

    state.set(State_Keys.SliderReady, false)

    const getAttribute = getElementAttribute(button, ATTRIBUTES.DIRECTION);
    const childrenSelector = getChildren(rootSelector);
    const isPrevDirection = getAttribute === FROM.PREV;

    setCurrentSlide({
      from: isPrevDirection ? FROM.PREV : FROM.NEXT,
      rootSelector,
    });

   
    const slideIndex = state.get(State_Keys.SlideIndex);

    const setActiveDot = () => {
      updateDots(slideIndex, rootSelector);
    };

    matchStateOptions(rootSelector, { [State_Keys.Dots]: true }, setActiveDot);

    
    listener(EVENTS.TRANSITIONEND, childrenSelector, () => {
      state.set(State_Keys.SliderReady, true)
    });

    
  };
}
