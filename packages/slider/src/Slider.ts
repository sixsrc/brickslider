import { c } from "vite/dist/node/types.d-aGj9QkWt"
import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Mutate } from "./Mutate"
import { Observer } from "./Observer"
import { StateType } from "./State"
import { CLASS_VALUES, TAGS, TIMES } from "./constants"
import {
  addClass,
  getAllElements,
  getDotsSelector,
  getSliderNodeList,
  hasClass,
  indexBasedBy,
  isNotMapped,
  removeClass,
  shouldApplyAdjustment,
  waitFor
} from "./helpers"
import { CurrentEventType, TypeTargetSlideParams } from "./types"

export class Slider extends BaseSlider {
  private animation: AnimationFrame
  private currentIndex: number
  //private translate: number
  private slides: HTMLElement[]
  mutate: Mutate
  static slides: any
  private targetDataIndex: null | string

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
    this.currentIndex = 0
    this.targetDataIndex = null
    // this.translate = 0
    this.slides = getSliderNodeList($root)
    this.mutate = new Mutate($root)
  }

  private getVisibleSlides(mov: string, slidesPerPage: number) {
    const { slidesPerView } = this.store
    const currentIndex = 1

    // Array para armazenar todos os elementos dos slides visíveis
    const visibleSlideElements = []

    // Filtra os slides para obter apenas os não-clonados
    const slides = this.slidesArr.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    )

    // Calcula o total de slides não-clonados
    const totalSlides = slides.length

    // Calcula qual será o novo índice inicial com base na direção de movimento
    let newFirstIndex

    if (mov === "decrement") {
      // Navegação para trás
      newFirstIndex = currentIndex - slidesPerPage

      // Se o slider for infinito, ajusta índices negativos
      if (newFirstIndex <= 0) {
        newFirstIndex = totalSlides + newFirstIndex
      }
    } else if (mov === "increment") {
      // Navegação para frente
      newFirstIndex = currentIndex + slidesPerPage

      // Se o slider for infinito, ajusta índices que ultrapassam o total
      if (newFirstIndex > totalSlides) {
        newFirstIndex = newFirstIndex - totalSlides
      }
    } else {
      throw new Error("Movimento inválido. Use 'increment' ou 'decrement'")
    }

    // Calcula os índices de todos os slides que ficarão visíveis
    for (let i = 0; i < slidesPerView; i++) {
      let slideIndex = newFirstIndex + i

      // Ajusta se o índice ultrapassar o total de slides (loop infinito)
      if (slideIndex > totalSlides) {
        slideIndex = slideIndex - totalSlides
      }

      // Encontra o elemento do slide correspondente
      const slideElement = Array.from(slides).find(
        slide =>
          parseInt((slide as HTMLElement).getAttribute("data-index")!) ===
          slideIndex
      )

      // Adiciona o elemento ao array de slides visíveis
      if (slideElement) {
        visibleSlideElements.push(slideElement)
      }
    }

    return visibleSlideElements
  }

  private getVisibleSlidesDecrement(slidesPerPage: number) {
    const { slidesPerView } = this.store
    // Calcula qual será o novo índice inicial após um decrement
    const currentIndex = 1
    let newFirstIndex = currentIndex - slidesPerPage
    const slides = this.slidesArr.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    )
    const totalSlides = this.slidesArr.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    ).length

    // Se o slider for infinito, ajusta índices negativos
    if (newFirstIndex <= 0) {
      newFirstIndex = totalSlides + newFirstIndex
    }

    // Array para armazenar todos os elementos dos slides visíveis
    const visibleSlideElements = []

    // Calcula os índices de todos os slides que ficarão visíveis
    for (let i = 0; i < slidesPerView; i++) {
      let slideIndex = newFirstIndex + i

      // Ajusta se o índice ultrapassar o total de slides (loop infinito)
      if (slideIndex > totalSlides) {
        slideIndex = slideIndex - totalSlides
      }

      // Encontra o elemento do slide correspondente
      const slideElement = Array.from(slides).find(
        slide =>
          parseInt((slide as HTMLElement).getAttribute("data-index")!) ===
          slideIndex
      )

      // Adiciona o elemento ao array de slides visíveis
      if (slideElement) {
        visibleSlideElements.push(slideElement)
      }
    }

    return visibleSlideElements
  }

  private lastActiveSlide(element: HTMLElement[]) {
    const slide = [...element]
      .reverse()
      .find(
        slide =>
          hasClass(slide, CLASS_VALUES.ACTIVE) &&
          slide === element[element.length - 1]
      )

    return slide
  }

  private getSlideIndex(slide: HTMLElement): number {
    return parseInt(slide.dataset.index as string)
  }

  private isFirstOrLastActiveSlide(slide: HTMLElement): boolean {
    return (
      // slide === this.firstActiveSlide(this.slides) ||
      slide === this.lastActiveSlide(this.slides)
    )
  }

  public setSlideTarget(params: TypeTargetSlideParams): void {
    const {
      slidesPerPage,
      slidesPerView,
      infinite,
      currentSlideMovement: mov,
      activePage,
      numberOfPages
    } = this.store
    //const firstActiveIndex = this.firstActiveSlideIndex(this.slidesArr)
    const clonedSlides = this.slidesArr.filter(slide =>
      hasClass(slide, CLASS_VALUES.CLONED)
    )
    /*const isLeftOver = shouldApplyAdjustment(
      this.slidesArr.length,
      slidesPerPage,
      clonedSlides.length
    )*/
    const { leftOver } = this.getMissingSlides()
    const isLeftOver = leftOver > 1
    console.log("isLeftOver", leftOver)
    //const isLeftOver = this.slidesArr.length % slidesPerView !== 1
    const isLimitLeft = infinite && mov === "decrement" && activePage === 0
    const isLimitRight =
      infinite && mov === "increment" && activePage === numberOfPages - 1
    const slidesGroup =
      isLeftOver && isLimitLeft ? slidesPerView : slidesPerPage
    const slidesGroup2 =
      isLeftOver && isLimitRight ? slidesPerView : slidesPerPage

    const result = this.getVisibleSlidesDecrement(slidesGroup)
    const result2 = this.getVisibleSlides(mov as string, slidesGroup2)

    if (infinite) {
      this.targetDataIndex = (result[0] as HTMLElement).dataset.index as string
      console.log("result", result)
      console.log("result2", result2)
    }

    this.setIndexBased(params)
    this.mapSlideIndex() ? null : this.nextAction()
  }

  private nextAction() {
    this.animationFrame()
    this.calcTranslate()
    this.setState(this.mainState())
    this.updateDOM()
    this.updateSlider()
  }

  private setIndexBased(params: TypeTargetSlideParams): void {
    const { slideIndex, infinite, currentEventType } = this.store
    const from = currentEventType as CurrentEventType
    const isTargetFrom = from === "dots"

    let { touchIndex } = params!

    if (touchIndex !== undefined) {
      if (infinite && isTargetFrom) touchIndex = touchIndex + 1
    }

    this.currentIndex = indexBasedBy({
      from,
      slideIndex,
      touchIndex
    })
  }

  private mapSlideIndex(): boolean {
    const { infinite, numberOfSlides } = this.store
    const { currentIndex } = this

    return isNotMapped(infinite, currentIndex, numberOfSlides)
  }

  private animationFrame() {
    requestAnimationFrame(this.animation.init)
  }

  private mainState(): Partial<StateType> {
    let { currentIndex, translate } = this
    const { currentEventType, currentSlideMovement: mov } = this.store
    const isDotTarget = currentEventType === "dots"
    const startPos = isDotTarget ? { startPos: 0 } : {}

    translate =
      mov === "increment"
        ? translate + Math.abs(this.store.currentTranslate)
        : Math.abs(this.store.currentTranslate) - translate

    return {
      ...startPos,
      slideIndex: currentIndex,
      prevTranslate: -translate,
      currentTranslate: -translate
    }
  }

  public defineDotIndex(): void {
    const { currentSlideMovement: mov, isPagedActive } = this.store

    if (mov && isPagedActive) {
      const { dotIndex } = this.defineIncrementOrDecrement()
      this.reorderActiveDot(dotIndex)
    }
  }

  private reorderActiveDot(dotIndex: number) {
    const { slideIndex, infinite } = this.store
    dotIndex = this.mapDotIndex().get(`${infinite}-${slideIndex}`) ?? dotIndex
    this.setState({ dotIndex })
  }

  private mapDotIndex(): Map<string, number | undefined> {
    const { slideIndex, numberOfSlides, infinite } = this.store
    const dotIndexMap = new Map<string, number | undefined>([
      [`true-0`, infinite ? numberOfSlides - 1 : 0],
      [`true-${numberOfSlides + 1}`, infinite ? 0 : undefined],
      [`false-${numberOfSlides - 1}`, slideIndex]
    ])

    return dotIndexMap
  }

  protected defineIncrementOrDecrement() {
    let { currentSlideMovement: mov, dotIndex, numberOfPages } = this.store

    console.log("dotIndex", dotIndex, numberOfPages)

    if (mov === "increment") dotIndex++
    else dotIndex--

    if (dotIndex === -1) dotIndex = numberOfPages - 1
    //   else if (dotIndex > numberOfPages - 1) dotIndex = 0

    return { dotIndex }
  }

  public updateSlider() {
    this.defineDotIndex()
    this.updateDots(this.$root)

    /*
        return (
          slide.dataset.index === this.targetDataIndex &&
          !hasClass(slide, CLASS_VALUES.CLONED)
        )
        */

    const { infinite, currentSlideMovement: mov, spacing } = this.store

    if (infinite && this.slidesArrBoundary && mov === "decrement") {
      /* let translate = 0

      const clonedIndex = this.slidesArr.findIndex(slide => {
        return (
          slide.dataset.index === "1" && hasClass(slide, CLASS_VALUES.CLONED)
        )
      })

      this.targetSlides = this.slidesArr.slice(0, clonedIndex)

      this.lastIndex = this.slidesArr.indexOf(
        this.targetSlides[this.targetSlides.length - 1]
      )

      this.forEachSlide(this.targetSlides, slide => {
        translate += slide.offsetWidth + spacing
      })

      this.setState({
        currentTranslate: -translate,
        prevTranslate: -translate,
        currentSlideMovement: "increment"
      })

      this.animate(this.$children, this.keyFrames(), this.options(0))

      waitFor(0, () => {
        let translate = 0
        const index = this.slidesArr.findIndex(
          slide =>
            slide.dataset.index === this.targetDataIndex &&
            !hasClass(slide, CLASS_VALUES.CLONED)
        )
        this.targetSlides = this.slidesArr.slice(0, index)

        this.forEachSlide(this.targetSlides, slide => {
          translate += slide.offsetWidth + spacing
        })

        this.setState({
          currentTranslate: -translate,
          prevTranslate: -translate,
          currentSlideMovement: "decrement"
        })
      })

      this.animate(this.$children, this.keyFrames(), this.options())*/
    }
    if (infinite && this.slidesArrBoundary && mov === "increment") {
      /* let translate = 0
      const { spacing } = this.store
      const clonedIndex = this.slidesArr.findIndex(slide => {
        return (
          slide.dataset.index === "6" && hasClass(slide, CLASS_VALUES.CLONED)
        )
      })

      this.targetSlides = this.slidesArr.slice(0, clonedIndex)

      this.forEachSlide(this.targetSlides, slide => {
        translate += slide.offsetWidth + spacing
      })

      this.setState({
        currentTranslate: -translate,
        prevTranslate: -translate,
        currentSlideMovement: "decrement"
      })
      this.animate(this.$children, this.keyFrames(), this.options())

      waitFor(0, () => {
        let translate = 0
        const index = this.slidesArr.findIndex(
          slide =>
            slide.dataset.index === "1" && !hasClass(slide, CLASS_VALUES.CLONED)
        )
        this.targetSlides = this.slidesArr.slice(0, index)

        this.forEachSlide(this.targetSlides, slide => {
          translate += slide.offsetWidth + spacing
        })

        this.setState({
          currentTranslate: -translate,
          prevTranslate: -translate,
          currentSlideMovement: "increment"
        })
      })

      this.animate(this.$children, this.keyFrames(), this.options())

      */
    }
  }

  protected updateDOM(): void {
    const { slidesPerPage, slidesPerView, currentSlideMovement } = this.store
    const { $root } = this

    this.mutate.updateActiveSlides(currentSlideMovement as string)

    /* toggleClass2(
      getSliderNodeList($root),
      slidesPerView,
      slidesPerPage,
      currentSlideMovement
    )*/
  }

  public waitForAnimationEnd(callback?: () => void): void {
    Promise.all(
      this.$children.getAnimations().map(animation => animation.finished)
    ).then(() => {
      if (callback) {
        callback() // Executa o callback passado
      }
    })
  }
  public updateDots($root: string) {
    const { dotIndex } = this.store
    let selectedIndex = dotIndex ?? 0
    const { dots: isDots } = this.store
    const dots = getAllElements<HTMLElement>(TAGS.LI, getDotsSelector($root))

    if (!isDots) return {}

    dots.forEach((dot, i) => {
      if (hasClass(dot, CLASS_VALUES.SELECTED))
        removeClass(dot, CLASS_VALUES.SELECTED)

      if (i === Math.abs(selectedIndex)) {
        addClass([dot], CLASS_VALUES.SELECTED)
        this.setState({ activePage: i })
      }
    })
  }
}

/*

 if (currentIndex <= 0) {
      // translate = 0
    }

if (infinite && slidesPerView >= 2) {
      //currentIndex += 1
    }
*/
/* private applyTranslateToAdjacent(adjacentIndex: number, translate: number) {
    const lastSlide = this.slides[this.slides.length - 1]
    const lastSlideIndex = parseInt(lastSlide.dataset.index as string)
    const missingSlides = this.getMissingSlides()
    const slideWidthWithMargin = lastSlide.offsetWidth + this.store.spacing

    const adjustedTranslate = translate - slideWidthWithMargin
    const targetIndex = lastSlideIndex + 1

    this.forEachSlide(this.slides, slide => {
      if (this.getSlideIndex(slide) === targetIndex) {
        // Aplica o translate ajustado ao slide que seria o "próximo"

        this.animate(slide, this.keyFrames(adjustedTranslate), this.options(0))
      } else if (this.getSlideIndex(slide) === adjacentIndex) {
        // Aplica o translate normal para os outros slides adjacentes
        this.animate(slide, this.keyFrames(translate), this.options(0))
      }
    })
  }*/
/* protected calcTranslate(): number {
    // let { currentIndex } = this
    // currentIndex = this.checkCurrentIndex(currentIndex)

    this.translate = this.getSlidesSizes() as number

    return this.translate
  }*/
