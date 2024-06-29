import { BaseSlider } from "./BaseSlider"
import { State_Keys } from "./State"
import { CLASS_VALUES } from "./constants"
import { addClass, calcTranslate, getSliderNodeList } from "./helpers"

export class Slides extends BaseSlider {
  private slides: HTMLElement[] | null
  private clonedSlides: any[]

  constructor($root: string) {
    super($root)
    this.slides = getSliderNodeList(this.$root)
    this.clonedSlides = []
  }

  public cloneSlides(): void {
    this.duplicateSlides(this.store.slidesPerPage)
    this.setState()
    //this.updateDOM().transform()

    this.$children.animate(
      [
        {
          transform: `translate3d(${this.store.currentTranslate}px, 0px, 0px)`
        }
      ],
      {
        fill: "forwards"
      }
    )
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
        const { updateDOM, clonedSlides } = this

        clonedSlides.push(clone)

        updateDOM().addClass(clonedSlides, CLASS_VALUES.CLONED)

        index < slidesPerPage
          ? this.$children?.appendChild(clone)
          : this.$children?.insertBefore(clone, this.slides![0])
      }
    }
  }

  protected setState() {
    const newIndex = this.store[State_Keys.SlideIndex] + 1
    const translate = calcTranslate(
      this.$children!,
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
      // transform: () => transform(this.$root),
      addClass: (elements: (HTMLElement | Element)[], className: string) =>
        addClass(elements, className)
    }
  }
}
