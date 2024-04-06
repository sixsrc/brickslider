import { BaseSlider } from "./BaseSlider"
import { State_Keys } from "./State"
import { CLASS_VALUES, EVENTS } from "./constants"
import {
  addClass,
  calcTranslate,
  getSliderNodeList,
  listener,
  removeClass,
  transform,
  waitFor
} from "./helpers"

export class Slides extends BaseSlider {
  private slides: HTMLElement[] | null
  private clonedSlides: any[]
  private arrEvents: string[]

  constructor($root: string) {
    super($root)
    this.slides = getSliderNodeList(this.$root)
    this.clonedSlides = []
    this.arrEvents = [
      EVENTS.TOUCHEND,
      EVENTS.MOUSEUP,
      EVENTS.MOUSEMOVE,
      EVENTS.MOUSELEAVE
    ]
  }

  public cloneSlides(): void {
    this.duplicateSlides(this.store.slidesPerPage)
    this.setState()
    this.updateDOM().transform()
  }

  public setSlideEvents(clonedSlides: HTMLElement[]) {
    clonedSlides?.forEach((slide, index) => {
      this.setListener(slide, index)
    })
  }

  private setListener(slide: HTMLElement, index: number) {
    const { updateDOM } = this

    listener(this.arrEvents, slide, event => {
      if (event.type === "mouseup") console.log(event.type)
      if (index === 1) {
        //removeClass(this.$children, "transition")
      }
      const interval = setInterval(() => {
        const { isJumpSlide, isMouseLeave, isDragging, currentTranslate } =
          this.store

        if (
          (isJumpSlide && !isMouseLeave && event.type == "mousedown") ||
          event.type == "mouseleave"
        ) {
          if (index == 5 && currentTranslate < -2800) {
            // updateDOM().addClass([this.$children], "transition")
            clearInterval(interval)
          }
        }
      }, 50)
    })
  }
  private duplicateSlides(slidesPerPage: number) {
    const sliderCount = this.slides!.length

    if (sliderCount < slidesPerPage) return

    slidesPerPage = Math.min(slidesPerPage, sliderCount)

    this.loopByClonedSlides(slidesPerPage, sliderCount)
  }

  private loopByClonedSlides(slidesPerPage: number, slideCount: number): void {
    const endIndices = [...Array(slidesPerPage).keys()]
    const startIndices = [...Array(slidesPerPage).keys()]
      .map(i => slideCount - i - 1)
      .reverse()

    for (const indices of [endIndices, startIndices]) {
      for (const index of indices) {
        const clone = this.slides![index].cloneNode(true) as HTMLElement
        const { updateDOM } = this

        this.clonedSlides.push(clone)

        updateDOM().addClass(this.clonedSlides, CLASS_VALUES.CLONED)

        index < slidesPerPage
          ? this.$children.appendChild(clone)
          : this.$children.insertBefore(clone, this.slides![0])
      }
    }
  }

  protected setState() {
    const newIndex = this.store[State_Keys.SlideIndex] + 1
    const translate = calcTranslate(
      this.$children,
      this.store[State_Keys.SlideSpacing],
      newIndex
    )

    this.state.set({
      [State_Keys.CurrentTranslate]: translate,
      [State_Keys.PrevTranslate]: translate,
      [State_Keys.SlideIndex]: newIndex
    })
  }

  protected updateDOM() {
    return {
      transform: () => transform(this.$root),
      addClass: (elements: (HTMLElement | Element)[], className: string) =>
        addClass(elements, className)
    }
  }
}
