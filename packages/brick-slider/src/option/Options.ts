type typeTransition = "fade" | "slide" | "thorn" | "lines" | "halftone" | "brush"

export type TypeOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sliderOptions?: any
  spacing?: number | null
  slidesPerPage?: number | null
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
  spacing?: number | null
  slidesPerPage?: number | null
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
    this.spacing = options?.spacing ?? 10
    this.slidesPerPage = options?.slidesPerPage ?? 1
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
