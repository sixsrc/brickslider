import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Mount } from "./Mount"
import { Observer } from "./Observer"
import { Slides } from "./Slides"
import { TypeOptions } from "./State"
import { EVENTS } from "./constants"

import {
  addClass,
  assert,
  isValidSelector,
  listener,
  removeClass,
  setStyle,
  transform,
  waitFor
} from "./helpers"

export class BrickSlider extends BaseSlider {
  private slides: Slides
  private mount: Mount
  public options?: TypeOptions
  private observer: Observer
  animation: AnimationFrame

  constructor($root: string, options?: TypeOptions) {
    super($root)
    assert(isValidSelector($root), "Main Selector Not Found")
    this.options = options
    this.slides = new Slides(this.$root)
    this.mount = new Mount(this.$root)
    options && this.state.setOptions(this.options!)
    this.observer = new Observer(this.$children)
    this.animation = new AnimationFrame(this.$root)
  }

  public init(): void {
    const { infinite, slideIndex, currentTranslate, startPos } = this.store

    if (infinite) this.slides.cloneSlides()

    this.mount.init()

    listener(
      [EVENTS.TOUCHEND, EVENTS.MOUSELEAVE, EVENTS.MOUSEUP],
      this.$children,
      event => {
        const {
          infinite,
          slideIndex,
          isTouch,
          isMouseLeave,
          currentTranslate,
          startPos
        } = this.store
        // console.log(event)
        if (
          (infinite && isTouch && !isMouseLeave && slideIndex === 1) ||
          slideIndex === 5 /*&&
            Math.abs(currentTranslate) <= 588 - (588 * 1) / 100)*/
        ) {
          if (event.type !== "mousemove") {
            /*const setTranslate = Math.abs(currentTranslate) + 2352
            // state.set(State_Keys.IsJumpSlide, true)
            //state.set(State_Keys.SlideIndex, 4)
            //state.set(State_Keys.currentTranslate, -setTranslate)

            removeClass(this.$children, "transition")
            removeClass(this.$children, "transition-50")
            removeClass(this.$children, "transition-400")

            this.state.set({
              isJumpSlide: true,
              slideIndex: 4,
              currentTranslate: -setTranslate
            })

            requestAnimationFrame(this.animation.init)
            transform(this.$root, -setTranslate)

            waitFor(0, () => {
              this.state.set({
                isJumpSlide: false,
                currentTranslate: -2352,
                prevTranslate: -2352
              })
              addClass([this.$children], "transition")
              addClass([this.$children], "transition-400")
              requestAnimationFrame(this.animation.init)
              transform(this.$root, -2352)
            })*/
          }
        }
      }
    )

    listener([EVENTS.TRANSITIONEND], this.$children, () => {})

    this.observer.init("getTranslateValue", () => {
      let { currentTranslate, animationID, spacing, slideIndex, sliderWidth } =
        this.store
      if (infinite)
        if (infinite && currentTranslate >= -0) {
          this.state.set({
            sliderReady: false
          })
          waitFor(0, () => {
            this.state.set({
              sliderReady: true,
              currentTranslate: -2352,
              prevTranslate: -2352,
              slideIndex: 4
            })
          })
        }
      if (slideIndex === 1 && currentTranslate === -588) {
        /*  waitFor(100, () => {
            this.state.set({
              isJumpSlide: true,
              slideIndex: 5,
              currentTranslate: -2940,
              prevTranslate: -2940
            })
          })

          waitFor(400, () => {
            this.state.set({
isJumpSlide: false
            })
          })
*/
      }

      //console.log((sliderWidth + spacing) * slideIndex, currentTranslate * -1)
    })
  }

  public next() {}

  public prev() {}

  public goTo(index: number) {}

  public play() {}

  public pause() {}

  public stop() {}

  public destroy() {}
}
