import { State, State_Keys } from "../../state/BrickState";
import { transform } from "../../transition/transform";

export class RequestAnimationFrame {
  rootSelector: string;
  state: State;

  constructor(rootSelector: string) {
    this.state = new State(rootSelector);
    this.rootSelector = rootSelector;
  }
  public init = (): void => {
    const { state, rootSelector, init } = this;

    const [currentTranslate, isDragging] = [
      state.get(State_Keys.currentTranslate),
      state.get(State_Keys.isDragging),
    ];

    transform(rootSelector, currentTranslate);

    isDragging && requestAnimationFrame(init);
  };
}
