import { addClass } from "@/dom/addClass"
import { getChildren } from "@/dom/getChildren"
import { getSlideNodeList } from "@/dom/getSlideNodeList"
import { State, StateType, State_Keys } from "@/state/BrickState"
import { transform as transformSlider } from "@/transition/transform"
import { calcTranslate } from "@/util/calcTranslate"
import { CLASS_VALUES } from "@/util/constants"

export class Slides {
  private $children: HTMLElement
  private slides: HTMLElement[] | null
  private clonedSlides: any[]
  private state: State
  public store: StateType

  constructor(private $root: string) {
    this.$root = $root
    this.$children = getChildren(this.$root)
    this.slides = getSlideNodeList(this.$root)
    this.clonedSlides = []
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
  }

  public cloneSlides(): void {
    const { spacing } = this.store

    this.duplicateSlides(this.state.store[State_Keys.SlidesPerPage])

    const newIndex = this.state.store[State_Keys.SlideIndex] + 1
    const translate = calcTranslate(this.$children, spacing, newIndex)

    this.state.seti({
      [State_Keys.CurrentTranslate]: translate,
      [State_Keys.PrevTranslate]: translate,
      [State_Keys.SlideIndex]: newIndex
    })

    transformSlider(this.$root, translate)
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

        this.clonedSlides.push(clone)

        addClass(this.clonedSlides, CLASS_VALUES.CLONED)

        index < slidesPerPage
          ? this.$children.appendChild(clone)
          : this.$children.insertBefore(clone, this.slides![0])
      }
    }
  }
}
