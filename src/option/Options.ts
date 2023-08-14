import { IOptions } from "./IOptions";

export class Options {
  autoplay?: boolean;
  autoplaySpeed?: number;
  dots?: boolean;
  arrows?: boolean;
  touch?: boolean;
  infinite?: boolean;
  speed?: number;
  mode?: "horizontal" | "vertical";
  transition?: "fade" | "slide";
  useTailwind?: boolean;

  constructor(options?: IOptions) {
    this.autoplay = options?.autoplay ?? false;
    this.autoplaySpeed = options?.autoplaySpeed ?? 500;
    this.dots = options?.dots ?? true;
    this.arrows = options?.arrows ?? true;
    this.infinite = options?.infinite ?? false;
    this.speed = options?.speed ?? 500;
    this.mode = options?.mode ?? "horizontal";
    this.transition = options?.transition ?? "slide";
    this.touch = options?.touch ?? true;
    this.useTailwind = options?.useTailwind ?? true;
  }
}
