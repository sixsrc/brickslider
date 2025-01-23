import { State, StateType } from "./State"
import { ANIMATION_OPTIONS, CLASS_VALUES } from "./constants"
import {
  animateElement,
  calcTranslate,
  getEventType,
  getChildren,
  getChildrenCount,
  getRootSelector,
  getSliderWidth,
  getTrackChildren,
  translate3d,
  hasClass,
  getSliderNodeList
} from "./helpers"
import {
  AnimationOptions,
  KeyframeAnimation,
  MouseEventOrTouchEvent
} from "./types"

export class BaseSlider {
  protected $root: string
  protected getRootSelector: HTMLElement | undefined
  protected state: State
  protected store: StateType
  protected $children: HTMLElement
  protected getTrackChildren: HTMLElement | any
  protected childrenCount: number
  protected sliderWidth: number | undefined
  protected movement: boolean
  protected dotIndex: number
  protected incompleteGroup: boolean
  private activeSlides: HTMLElement[]
  protected previousTranslate: number

  constructor($root: string) {
    this.$root = $root
    this.getRootSelector = getRootSelector($root)
    this.activeSlides = getSliderNodeList($root)
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
    this.$children = getChildren(this.$root) as HTMLElement
    this.getTrackChildren = getTrackChildren($root)
    this.childrenCount = getChildrenCount(this.$children)
    this.sliderWidth = getSliderWidth(this.$children)
    this.movement = false
    this.previousTranslate = 0
    this.dotIndex = 0
    this.incompleteGroup = false
  }

  protected defineEventTarget(event: MouseEventOrTouchEvent) {
    const clientX = getEventType(event).clientX
    const clientY = getEventType(event).clientY

    return {
      clientX,
      clientY
    }
  }

  protected forEachSlide(
    slides: HTMLElement[],
    callback: (slide: HTMLElement, index: number) => void
  ): void {
    slides.forEach((slide, index) => callback(slide, index))
  }

  protected isDotTarget(numberOfSlides: number): void {
    if (this.dotIndex === -1) this.dotIndex = numberOfSlides - 1
    else if (this.dotIndex === numberOfSlides) this.dotIndex = 0
  }

  protected animate(
    element: HTMLElement,
    keyFrames: KeyframeAnimation[],
    options: AnimationOptions
  ): void {
    animateElement(element, keyFrames, options)
  }

  protected calcTranslate(index: number): number {
    const { spacing } = this.store
    const { $children } = this

    return calcTranslate($children, spacing, index)
  }

  private getActiveSlides() {
    const activeSlides = this.activeSlides.filter(el =>
      hasClass(el, CLASS_VALUES.ACTIVE)
    )
    const lastActiveSlide = activeSlides.at(-1) || null
    const activeIndex = parseInt(lastActiveSlide?.dataset.index as string)

    return { lastActiveSlide, activeIndex }
  }

  /*private activeSlidesLoop(activeIndex: number) {
    const { slidesPerPage, spacing, currentSlideMovement:mov } = this.store
    const inc = mov === 'increment'

    let translate = 0
    let selectedSlides = null
    let slideWidth = 0
    let nextSlideIndex = 0

    for (let i = 0; i < slidesPerPage; i++) {
      nextSlideIndex = activeIndex + i

      selectedSlides = Array.from(this.activeSlides).find(
        slide => parseInt(slide.dataset.index as string) === nextSlideIndex
      )

      console.log("selectedSlides", nextSlideIndex)

      if (selectedSlides) {
        slideWidth = (selectedSlides.offsetWidth + spacing) as any
        translate += slideWidth
      }
    }

    return translate
  }*/

  private activeSlidesLoop(activeIndex: number) {
    const { slidesPerPage, spacing, currentSlideMovement: mov } = this.store
    const isIncrement = mov === "increment"

    let translate = 0

    // Converta os slides para array
    const slidesArray = Array.from(this.activeSlides)

    // Localize o último slide ativo
    const activeSlides = slidesArray.filter(slide =>
      slide.classList.contains("active")
    )
    const lastActiveSlide = activeSlides[activeSlides.length - 1]

    if (!lastActiveSlide) {
      console.warn("Nenhum slide ativo encontrado!")
      return 0
    }

    // Pegue o índice do último slide ativo no array
    const lastActiveIndex = slidesArray.indexOf(lastActiveSlide)

    // Determine os slides-alvo com base no movimento
    let targetSlides: HTMLElement[]
    if (isIncrement) {
      // Pegue os próximos slides com base no slidesPerPage
      targetSlides = slidesArray.slice(
        lastActiveIndex + 1,
        lastActiveIndex + 1 + slidesPerPage
      )
      console.log(targetSlides)
    } else {
      // Pegue os slides anteriores com base no slidesPerPage
      targetSlides = slidesArray.slice(
        Math.max(0, lastActiveIndex - slidesPerPage),
        lastActiveIndex
      )
    }

    // Calcule o deslocamento (translate)
    targetSlides.forEach(slide => {
      translate += slide.offsetWidth + spacing
    })

    console.log("translate", translate)

    return translate
  }

  protected getSlidesSizes(currentIndex: number): number | undefined {
    const { lastActiveSlide, activeIndex } = this.getActiveSlides()

    if (!lastActiveSlide) return

    return this.activeSlidesLoop(currentIndex)
  }

  protected options(duration = 0): AnimationOptions {
    return {
      duration,
      easing: ANIMATION_OPTIONS.EASEOUT,
      fill: ANIMATION_OPTIONS.FORWARDS
    }
  }

  protected keyFrames(translate?: number): KeyframeAnimation[] {
    const { currentTranslate } = this.store

    return [
      { transform: translate3d(translate ? translate : currentTranslate) }
    ]
  }

  protected setState(state: Partial<StateType>) {
    this.state.set(state)
  }

  protected slidePager(
    slides: HTMLElement[],
    slidesPerPage: number
  ): Record<number, number[]> {
    const slideIndices = slides.map(slide =>
      parseInt(slide.getAttribute("data-index") || "0", 10)
    ) // Obtém todos os data-index dos slides

    // Cria o objeto de páginas
    const slidesByPage: Record<number, number[]> = {}

    slideIndices.forEach((index, idx) => {
      const pageIndex = Math.floor(idx / slidesPerPage)

      if (!slidesByPage[pageIndex]) {
        slidesByPage[pageIndex] = [] // Inicializa a página
      }
      slidesByPage[pageIndex].push(index) // Adiciona o índice ao grupo da página
    })

    // console.log("Mapeamento de slides por página:", slidesByPage)
    return slidesByPage // Retorna o objeto
  }
}
