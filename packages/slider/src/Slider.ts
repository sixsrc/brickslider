import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Mutate } from "./Mutate"
import { StateType } from "./State"
import { Observer } from "./Observer"
import { CLASS_VALUES, DOM_ELEMENTS, TAGS } from "./constants"
import {
  addClass,
  getAllElements,
  getDotsSelector,
  getSliderNodeList,
  hasClass,
  indexBasedBy,
  isNotMapped,
  removeClass,
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
  observer: Observer

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
    this.currentIndex = 0
    this.targetDataIndex = null
    // this.translate = 0
    this.slides = getSliderNodeList($root)
    this.mutate = new Mutate($root)
    this.observer = new Observer($root)
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

  public setSlideTarget(params: TypeTargetSlideParams) {
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
      //this.targetDataIndex = (result2[0] as HTMLElement).dataset.index as string
      //console.log("result2", result2)
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

  private async animationFrame() {
    const { slidesPerPage } = this.store

    if (this.isAnimating) return

    this.isAnimating = true

    await this.animation.init()

    await new Promise(resolve => {
      waitFor(50, () => {
        const visibleIndexes = this.observer?.getVisibleSlideIndexes() || []
        this.mutate.updateActiveSlides(visibleIndexes, slidesPerPage)
        resolve(true)
      })
    })

    this.isAnimating = false
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

    if (mov === "increment") dotIndex++
    else dotIndex--

    if (dotIndex === -1) dotIndex = numberOfPages - 1
    else if (dotIndex > numberOfPages - 1) dotIndex = 0

    return { dotIndex }
  }

  public updateSlider() {
    this.defineDotIndex()

    const waitForAnimation = setInterval(() => {
      if (!this.isAnimating) {
        this.updateDots(this.$root)
        clearInterval(waitForAnimation)
      }
    }, 10)

    const {
      infinite,
      jumpIndex,
      currentSlideMovement: mov,
      spacing,
      slideIndex,
      slidesPerPage,
      activePage,
      numberOfPages
    } = this.store

    if (infinite && mov === "decrement") {
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

    if (infinite && activePage === numberOfPages) {
      const index = this.slidesArr.findIndex(slide => {
        return (
          slide.dataset.index === "1" && hasClass(slide, CLASS_VALUES.CLONED)
        )
      })

      //this.mutate.setActiveIndex(index - slidesPerPage)
    }

    if (infinite && activePage === 1) {
      const { SINGLE_SLIDE } = DOM_ELEMENTS
      const { ACTIVE } = CLASS_VALUES

      const allActive = getAllElements<HTMLElement>(
        `${this.$root} ${SINGLE_SLIDE}.${ACTIVE}`,
        this.$children
      )
      const lastActive = allActive[allActive.length - 1]
      this.firstDataIndex = parseInt(allActive[0].dataset.index as string)
      this.targetDataIndex = lastActive?.dataset.index as string
    }

    if (
      infinite &&
      activePage === 2 &&
      slideIndex > activePage &&
      mov === "increment"
    ) {
      let translate = 0
      const { spacing, currentSlideMovement: mov } = this.store
      const clonedIndex = this.slidesArr.findIndex(slide => {
        return (
          slide.dataset.index === "1" && !hasClass(slide, CLASS_VALUES.CLONED)
        )
      })

      console.log("clonedIndex", clonedIndex)

      this.targetSlides = this.slidesArr.slice(0, clonedIndex)

      this.forEachSlide(this.targetSlides, slide => {
        translate += slide.offsetWidth + spacing
      })

      this.setState({
        currentTranslate: -translate,
        prevTranslate: -translate,
        currentSlideMovement: "increment"
      })
      this.animate(this.$children, this.keyFrames(), this.options())

      waitFor(0, () => {
        /*  let translate = 0
        const targetIndex = Number(this.targetDataIndex)
        const dataset = targetIndex + 1
        const indextoString = dataset.toString()
        const index = this.slidesArr.findIndex(
          slide =>
            slide.dataset.index === indextoString &&
            !hasClass(slide, CLASS_VALUES.CLONED)
        )

        this.targetSlides = this.slidesArr.slice(0, index)

        this.forEachSlide(this.targetSlides, slide => {
          translate += slide.offsetWidth + spacing
        })

        this.setState({
          isJumpSlide: true,
          currentTranslate: -translate,
          prevTranslate: -translate,
          currentSlideMovement: "increment"
        })*/
      })
    }
  }

  protected updateDOM(): void {}

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

        this.setState({ activePage: i + 1 })
      }
    })
  }
}
