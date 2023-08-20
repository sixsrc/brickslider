import { IOptions } from "../option/IOptions";

export enum State_Keys {
  RootSelector = "rootSelector",
  SlideIndex = "slideIndex",
  NumberOfSlides = "numberOfSlides",
  SliderWidth = "sliderWidth",
  SliderReady = "sliderReady",
  isDragging = "isDragging",
  startPos = "startPos",
  prevTranslate = "prevTranslate",
  currentTranslate = "currentTranslate",
  animationID = "animationID",
  Autoplay = "autoplay",
  AutoplaySpeed = "autoplaySpeed",
  Dots = "dots",
  Arrows = "arrows",
  Touch = "touch",
  Infinite = "infinite",
  Speed = "speed",
  Mode = "mode",
  Transition = "transition",
  UseTailwind = "useTailwind",
}

class BrickState {
  static state: { [key: string]: any } = {};
  private key: string;

  constructor(key: string, options: IOptions = {}) {
    this.key = key;
    if (!BrickState.state[key]) {
      BrickState.state[key] = {};
      this.initializeState(options);
    }
  }

  private initializeState(options: IOptions) {
    BrickState.state[this.key][State_Keys.RootSelector] = null;
    BrickState.state[this.key][State_Keys.SlideIndex] = 0;
    BrickState.state[this.key][State_Keys.NumberOfSlides] = 0;
    BrickState.state[this.key][State_Keys.SliderWidth] = 0;
    BrickState.state[this.key][State_Keys.SliderReady] = true;
    BrickState.state[this.key][State_Keys.isDragging] = false;
    BrickState.state[this.key][State_Keys.startPos] = 0;
    BrickState.state[this.key][State_Keys.prevTranslate] = 0;
    BrickState.state[this.key][State_Keys.currentTranslate] = 0;
    BrickState.state[this.key][State_Keys.Autoplay] = options.autoplay ?? false;
    BrickState.state[this.key][State_Keys.AutoplaySpeed] =
      options.autoplaySpeed ?? 3000;
    BrickState.state[this.key][State_Keys.Dots] = options.dots ?? true;
    BrickState.state[this.key][State_Keys.Arrows] = options.arrows ?? true;
    BrickState.state[this.key][State_Keys.Touch] = options.touch ?? true;
    BrickState.state[this.key][State_Keys.Touch] = options.touch ?? true;
    BrickState.state[this.key][State_Keys.Infinite] = options.infinite ?? true;
    BrickState.state[this.key][State_Keys.Speed] = options.speed ?? 300;
    BrickState.state[this.key][State_Keys.Mode] = options.mode ?? "vertical";
    BrickState.state[this.key][State_Keys.Transition] =
      options.transition ?? "fade";
    BrickState.state[this.key][State_Keys.UseTailwind] =
      options.useTailwind ?? true;

    if (options.sliderOptions) {
      for (const key in options.sliderOptions) {
        if (options.sliderOptions.hasOwnProperty(key)) {
          BrickState.state[this.key][key] = options.sliderOptions[key];
        }
      }
    }
  }

  get<K extends keyof any>(prop: K): any[K] {
    return BrickState.state[this.key][prop] ?? "";
  }

  set<K extends keyof any>(prop: K, value: any[K]): any {
    BrickState.state[this.key][prop] = value;
  }

  setOptions(options: IOptions): any {
    this.initializeState(options);
  }

  setMultipleState(props: { [key: string]: any }): void {
    for (const key in props) {
      if (BrickState.state[this.key].hasOwnProperty(key)) {
        BrickState.state[this.key][key] = props[key];
      }
    }
  }
}

export { BrickState as State };
