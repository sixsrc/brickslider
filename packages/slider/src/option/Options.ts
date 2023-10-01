type typeTransition = "fade" | "slide" | "thorn" | "lines" | "halftone" | "brush"

export type TypeOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sliderOptions?: any
  margin?: number | null
  autoplay?: boolean
  autoplaySpeed?: number
  dots?: boolean
  arrows?: boolean
  touch?: boolean
  infinite?: boolean
  speed?: number
  transition?: typeTransition
  useTailwind?: boolean
}

export class Options {
  margin?: number | null
  autoplay?: boolean
  autoplaySpeed?: number
  dots?: boolean
  arrows?: boolean
  touch?: boolean
  infinite?: boolean
  speed?: number
  transition?: typeTransition
  useTailwind?: boolean

  constructor(options?: TypeOptions) {
    this.autoplay = options?.autoplay ?? false
    this.margin = options?.margin ?? 0
    this.autoplaySpeed = options?.autoplaySpeed ?? 500
    this.dots = options?.dots ?? true
    this.arrows = options?.arrows ?? true
    this.infinite = options?.infinite ?? false
    this.speed = options?.speed ?? 500
    this.transition = options?.transition ?? "slide"
    this.touch = options?.touch ?? true
    this.useTailwind = options?.useTailwind ?? true
  }
}
