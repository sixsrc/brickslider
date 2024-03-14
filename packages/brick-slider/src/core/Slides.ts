import { addClass } from "@/dom"
import { State, StateType } from "@/state"
import { arrayToClasses, calcTranslate } from "@/util"
import { Actions } from "./Actions"
import { CLASS_VALUES } from "@/util/constants"

export class Slides {
  private $children: HTMLElement | null
  private slides: HTMLElement[] | null

  constructor(private $root: string) {
    this.$children = null
    this.slides = []
  }

  public cloneSlides(): void {
    const instances = arrayToClasses([State, Actions], this.$root)
    const [state, slider] = instances as [State, Actions]
    const { currentTranslate, slideSpacing, slidesPerPage } =
      state.store as StateType
    const newIndex = currentTranslate + 1

    this.slides = slider.getSlideNodeList()
    this.$children = slider.getChildren()

    this.duplicateSlides(slidesPerPage)

    const translate = calcTranslate(this.$children, slideSpacing, newIndex)

    slider.setTransform(translate)

    state.setMultipleState({
      currentTranslate: translate,
      prevTranslate: translate,
      slideIndex: newIndex
    })
  }

  private duplicateSlides(slidesPerPage: number) {
    const slideCount = this.slides!.length
    const clonedSlides: Node | (HTMLElement | Element)[] | null = []

    if (slideCount < slidesPerPage) return

    slidesPerPage = Math.min(slidesPerPage, slideCount)

    for (let i = 0; i < slidesPerPage; i++) {
      const cloneFirst = this.slides![i].cloneNode(true) as HTMLElement

      clonedSlides.push(cloneFirst)
      this.$children!.appendChild(cloneFirst)
    }

    for (let i = slideCount - slidesPerPage; i < slideCount; i++) {
      const cloneLast = this.slides![i].cloneNode(true) as HTMLElement

      clonedSlides.push(cloneLast)
      this.$children!.insertBefore(cloneLast, this.slides![0])
    }

    addClass(clonedSlides, CLASS_VALUES.CLONED)
  }
}
