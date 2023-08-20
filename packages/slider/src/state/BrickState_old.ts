export enum State_Keys {
  SlideIndex = "slideIndex",
  NumberOfSlides = "numberOfSlides",
  SliderWidth = "sliderWidth",
}
class BrickState {
  static state: { [key: string]: any } = {};
  private key: string;

  constructor(key: string) {
    this.key = key;
    if (!BrickState.state[key]) {
      BrickState.state[key] = {};
      this.initializeState();
    }
  }

  private initializeState() {
    BrickState.state[this.key][State_Keys.SlideIndex] = 0;
    BrickState.state[this.key][State_Keys.NumberOfSlides] = 0;
    BrickState.state[this.key][State_Keys.SliderWidth] = 0;
  }

  get<K extends keyof any>(prop: K): any[K] {
    return BrickState.state[this.key][prop];
  }

  set<K extends keyof any>(prop: K, value: any[K]): void {
    BrickState.state[this.key][prop] = value;
  }
}

export { BrickState as State };
