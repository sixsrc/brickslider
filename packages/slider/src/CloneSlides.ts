import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { addClass, calcTranslate, getSliderNodeList } from "./helpers"

export class CloneSlides extends BaseSlider {
  private slides: HTMLElement[] | null
  private clonedSlides: any[]

  constructor($root: string) {
    super($root)
    this.slides = getSliderNodeList(this.$root)
    this.clonedSlides = []
  }

  public init(): void {
    this.duplicateSlides()

    this.setState(this.slidePositionState())

    this.animate(this.keyFrames(), this.options())
  }

  private duplicateSlides() {
    let { slidesPerPage } = this.store

    const sliderCount = this.slides!.length

    if (sliderCount < slidesPerPage) return

    slidesPerPage = Math.min(slidesPerPage, sliderCount)

    this.loopByClonedSlides(slidesPerPage, sliderCount)
  }

  private loopByClonedSlides(slidesPerPage: number, slideCount: number): void {
    const end = [...Array(slidesPerPage).keys()]
    const start = [...Array(slidesPerPage).keys()]
      .map(i => slideCount - i - 1)
      .reverse()

    console.log(end, start)

    for (const indices of [end, start]) {
      for (const index of indices) {
        const { $children, slides, clonedSlides } = this
        const clone = slides![index].cloneNode(true) as HTMLElement

        // console.log("cloned", clonedSlides)

        clonedSlides.push(clone)

        addClass(clonedSlides, CLASS_VALUES.CLONED)

        index < slidesPerPage
          ? $children?.appendChild(clone)
          : $children?.insertBefore(clone, slides![0])
      }
    }
  }

  /* private loopByClonedSlides(slidesPerPage: number, slideCount: number): void {
    const slidesToClone = slidesPerPage + 1 // Clonar mais um slide que o número de slides por página

    // Índices dos últimos slides que serão clonados no início
    const start = [...Array(slidesToClone).keys()].map(
      i => slideCount - slidesToClone + i
    )

    // Índices dos primeiros slides que serão clonados no final
    const end = [...Array(slidesToClone).keys()]

    // Clonar os slides do final para o início
    for (const index of start) {
      this.cloneSlide(index, false) // Insere antes do primeiro slide
    }

    // Clonar os slides do início para o final
    for (const index of end) {
      this.cloneSlide(index, true) // Insere depois do último slide
    }
  }*/

  // Função auxiliar para clonar os slides
  private cloneSlide(index: number, append: boolean) {
    const { $children, slides, clonedSlides } = this
    const clone = slides![index % slides!.length].cloneNode(true) as HTMLElement

    clonedSlides.push(clone)

    addClass(clonedSlides, CLASS_VALUES.CLONED)

    if (append) {
      $children?.appendChild(clone) // Adicionar no final
    } else {
      $children?.insertBefore(clone, slides![0]) // Adicionar no início
    }
  }

  private slidePositionState() {
    const { slideIndex } = this.store
    const translate = this.calcTranslate()

    return {
      currentTranslate: translate,
      prevTranslate: translate,
      slideIndex: slideIndex + 1
    }
  }

  protected calcTranslate() {
    const { slideIndex, spacing } = this.store
    const { $children } = this

    return calcTranslate($children!, spacing, slideIndex + 1)
  }
}
