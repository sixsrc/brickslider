import { State, type StateType } from "./State"
import { ANIMATION_OPTIONS, ATTRIBUTES, CLASS_VALUES } from "./constants"
import {
  animateElement,
  getEventType,
  getChildren,
  getChildrenCount,
  getRootSelector,
  getSliderWidth,
  getTrackChildren,
  translate3d,
  getSliderNodeList,
  hasClass
} from "./helpers"
import type {
  AnimationOptions,
  CurrentSlideMovement,
  KeyframeAnimation,
  MouseEventOrTouchEvent
} from "./types"

export class BaseSlider {
  protected $root: string
  protected getRootSelector: HTMLElement | undefined
  protected state: State
  protected store: StateType
  protected $children: HTMLElement
  protected $track: HTMLElement
  protected childrenCount: number
  protected sliderWidth: number | undefined
  protected firstDataIndex: number
  protected dotIndex: number
  protected translate: number
  protected slidesArrBoundary: boolean
  protected slidesArr: HTMLElement[]
  protected targetSlides: HTMLElement[]
  protected lastIndex: number
  protected prevSlides: HTMLElement[]
  protected isAnimating: boolean = false
  protected firstCloned: null | HTMLElement
  protected isIncompleteGroup: boolean
  movement: boolean
  inSafeTranslate: boolean
  activePage: number

  constructor($root: string) {
    this.$root = $root
    this.getRootSelector = getRootSelector($root)
    this.slidesArr = getSliderNodeList($root)
    this.prevSlides = []
    this.targetSlides = []
    this.firstCloned = null
    this.isIncompleteGroup = false
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
    this.$children = getChildren(this.$root) as HTMLElement
    this.$track = getTrackChildren($root) as HTMLElement
    this.childrenCount = getChildrenCount(this.$children)
    this.sliderWidth = getSliderWidth(this.$children)
    this.firstDataIndex = 0
    this.translate = 0
    this.dotIndex = 0
    this.lastIndex = 0
    this.movement = false
    this.slidesArrBoundary = false
    this.inSafeTranslate = false
    this.activePage = 0
  }

  public static getSlides($root: string, cloned?: boolean) {
    return getSliderNodeList($root, cloned)
  }

  protected defineEventTarget(event: MouseEventOrTouchEvent) {
    const clientX = getEventType(event).clientX
    const clientY = getEventType(event).clientY
    return { clientX, clientY }
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
  ): Animation[] {
    return animateElement(element, keyFrames, options)
  }

  protected calcTranslate(): number {
    this.translate = this.getSlidesSizes() as number

    // 🔧 HACK: Aplica o limite de segurança
    this.translate = this.safeTranslate(this.translate)

    return this.translate
  }

  protected safeTranslate(translate: number): number {
    const containerWidth = this.sliderWidth || 0
    let maxTranslate = this.getTotalWidth() - containerWidth
    const { currentEventType } = this.store

    if (translate > maxTranslate) {
      console.log("translate", translate)
      console.warn(
        `🔧 Translate ajustado: ${translate} -> ${maxTranslate} ${containerWidth}`
      )
      if (currentEventType === "touchend") {
        this.setState({
          currentTranslate: -maxTranslate,
          prevTranslate: -maxTranslate
        })
      }

      return maxTranslate
    }

    if (translate < 0) {
      return 0
    }

    return translate
  }

  protected getTotalWidth(): number {
    const { spacing } = this.store
    if (this.slidesArr.length === 0) return 0

    return this.slidesArr.reduce((total, slide, index) => {
      return (
        total +
        slide.offsetWidth +
        (index < this.slidesArr.length - 1 ? spacing : 0)
      )
    }, 0)
  }

  protected hasRemaining(totalSlides: number): boolean {
    const { slidesPerView, slidesPerPage } = this.store

    return (totalSlides - slidesPerView) % slidesPerPage !== 0
  }

  private getTargetSlides(
    slidesArr: HTMLElement[],
    currentIndex: number,
    count: number,
    direction: CurrentSlideMovement
  ): HTMLElement[] {
    const step = direction === "increment" ? 1 : -1

    return Array.from({ length: count }, (_, i) => {
      const idx = currentIndex + step * (i + 1)
      return slidesArr[idx] ?? null
    }).filter((el): el is HTMLElement => el !== null)
  }

  private getSlideRealIndex(slide: HTMLElement): number {
    return this.slidesArr.findIndex(s => s === slide)
  }

  private getNextSlidesToAdd(
    slidesArr: HTMLElement[],
    currentTargetSlides: HTMLElement[],
    slidesPerPage: number
  ): { slides: HTMLElement[]; addedCount: number; isIncomplete: boolean } {
    if (currentTargetSlides.length === 0) {
      // Se não há slides no target, pega os primeiros
      const initialSlides = slidesArr.slice(
        0,
        Math.min(slidesPerPage, slidesArr.length)
      )
      return {
        slides: initialSlides,
        addedCount: initialSlides.length,
        isIncomplete: initialSlides.length < slidesPerPage
      }
    }

    // Encontra o último índice dos slides atuais
    const lastSlideIndex = this.getSlideRealIndex(
      currentTargetSlides[currentTargetSlides.length - 1]
    )
    const nextStartIndex = lastSlideIndex + 1
    const nextEndIndex = Math.min(
      nextStartIndex + slidesPerPage,
      slidesArr.length
    )

    // Se não há mais slides para adicionar
    if (nextStartIndex >= slidesArr.length) {
      return {
        slides: currentTargetSlides,
        addedCount: 0,
        isIncomplete: false
      }
    }

    // Calcula quantos slides podem ser adicionados
    const availableSlides = slidesArr.slice(nextStartIndex, nextEndIndex)
    const addedCount = availableSlides.length
    const isIncomplete = addedCount < slidesPerPage

    // Adiciona novos slides aos existentes
    return {
      slides: [...currentTargetSlides, ...availableSlides],
      addedCount,
      isIncomplete
    }
  }

  private getSlidesToRemove(
    currentTargetSlides: HTMLElement[],
    slidesPerPage: number
  ): { slides: HTMLElement[]; removedCount: number; isIncomplete: boolean } {
    if (currentTargetSlides.length === 0) {
      return {
        slides: [],
        removedCount: 0,
        isIncomplete: false
      }
    }

    // Remove do final para trás baseado no slidesPerPage
    const removeCount = Math.min(slidesPerPage, currentTargetSlides.length)
    const newSlides = currentTargetSlides.slice(
      0,
      currentTargetSlides.length - removeCount
    )
    const isIncomplete =
      removeCount < slidesPerPage && currentTargetSlides.length > 0

    return {
      slides: newSlides,
      removedCount: removeCount,
      isIncomplete
    }
  }

  private updateTargetSlidesAccumulation(
    slidesArr: HTMLElement[],
    slidesPerPage: number,
    direction: CurrentSlideMovement
  ): HTMLElement[] {
    if (direction === "increment") {
      // Acumula mais slides
      const result = this.getNextSlidesToAdd(
        slidesArr,
        this.targetSlides,
        slidesPerPage
      )

      if (result.addedCount === 0) {
        console.log("Não há mais slides para adicionar - mantendo estado atual")
        this.isIncompleteGroup = false
        return this.targetSlides // Mantém os slides atuais
      }

      this.isIncompleteGroup = result.isIncomplete
      if (result.isIncomplete) {
        console.log(
          `Grupo incompleto: adicionados ${result.addedCount}/${slidesPerPage} slides`
        )
      }

      return result.slides
    } else {
      // Remove slides da acumulação
      const result = this.getSlidesToRemove(this.targetSlides, slidesPerPage)

      this.isIncompleteGroup = result.isIncomplete
      if (result.isIncomplete && result.removedCount > 0) {
        console.log(
          `Grupo incompleto: removidos ${result.removedCount}/${slidesPerPage} slides`
        )
      }

      return result.slides
    }
  }

  private checkIfAtEnd(): boolean {
    const { slidesPerView } = this.store
    if (this.targetSlides.length === 0) return false

    const lastSlideIndex = this.getSlideRealIndex(
      this.targetSlides[this.targetSlides.length - 1]
    )
    return (
      lastSlideIndex === this.slidesArr.length - 1 &&
      this.targetSlides.length >= slidesPerView
    )
  }

  private canMoveInDirection(direction: CurrentSlideMovement): boolean {
    const { slidesPerView } = this.store

    if (direction === "increment") {
      if (this.targetSlides.length === 0) return true
      const lastSlideIndex = this.getSlideRealIndex(
        this.targetSlides[this.targetSlides.length - 1]
      )

      // Se já chegou no final e tem slides suficientes para a view, não pode mais mover
      const isAtEnd = lastSlideIndex === this.slidesArr.length - 1
      const hasEnoughToShow = this.targetSlides.length >= slidesPerView

      return !isAtEnd && lastSlideIndex < this.slidesArr.length - 1
    } else {
      return this.targetSlides.length > 0
    }
  }

  private activeSlidesLoop(): number {
    let {
      spacing,
      slidesPerPage,
      slidesPerView,
      currentSlideMovement: mov
    } = this.store

    let translate = 0
    const slides = this.slidesArr

    // Verifica se chegou no final antes de tentar acumular
    if (mov === "increment") {
      if (this.checkIfAtEnd()) {
        console.log("Chegou no final - não pode mais avançar")
        this.isIncompleteGroup = false

        // Calcula translate com os slides atuais
        this.forEachSlide(this.targetSlides, slide => {
          translate += slide.offsetWidth + spacing
        })
        if (this.targetSlides.length > 0) {
          translate -= spacing
        }
        return translate
      }
    }

    // Verifica se pode mover na direção solicitada
    if (!this.canMoveInDirection(mov)) {
      console.log(`Não pode mover na direção: ${mov}`)

      // Retorna translate atual para movimento incremental
      if (mov === "increment") {
        this.forEachSlide(this.targetSlides, slide => {
          translate += slide.offsetWidth + spacing
        })
        if (this.targetSlides.length > 0) {
          translate -= spacing
        }
        return translate
      }

      // Para movimento decremental no limite, retorna 0
      return 0
    }

    // Atualiza targetSlides baseado na acumulação
    this.targetSlides = this.updateTargetSlidesAccumulation(
      slides,
      slidesPerPage,
      mov
    )

    console.log(`Movimento: ${mov}`)
    console.log(`Slides Per Page: ${slidesPerPage}`)
    console.log(`Slides Per View: ${slidesPerView}`)
    console.log(`Target Slides Count: ${this.targetSlides.length}`)
    console.log(
      `Target Slides:`,
      this.targetSlides.map(s => s.dataset.index || "no-index")
    )
    console.log(`Grupo incompleto: ${this.isIncompleteGroup}`)
    console.log(`Está no final: ${this.checkIfAtEnd()}`)

    // Calcula o translate baseado nos slides selecionados
    this.forEachSlide(this.targetSlides, slide => {
      translate += slide.offsetWidth + spacing
    })

    // Remove o spacing extra do último slide
    if (this.targetSlides.length > 0) {
      translate -= spacing
    }

    return translate
  }

  protected getMissingSlides(): { isMissing: boolean; leftOver: number } {
    const { slidesPerPage, slidesPerView } = this.store
    const totalSlides = BaseSlider.getSlides(this.$root, false).length
    const fullPages = Math.floor(totalSlides / slidesPerPage)
    const remainingSlides = totalSlides - fullPages * slidesPerPage
    const leftOver = Math.max(0, slidesPerView - remainingSlides)

    return { isMissing: leftOver > 0, leftOver }
  }

  protected getSlidesSizes(): number | undefined {
    ///if (!this.getLastActiveSlide()) return

    return this.activeSlidesLoop()
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
    return [{ transform: translate3d(translate ?? currentTranslate) }]
  }

  protected setState(state: Partial<StateType>) {
    this.state.set(state)
  }

  protected getFirstClonedIndex(): number {
    return this.prevSlides.findIndex(
      slide =>
        slide.dataset.index === "1" && hasClass(slide, CLASS_VALUES.CLONED)
    )
  }

  protected getFilteredSlides(slides: HTMLElement[], activeDataIndex: number) {
    return slides.filter(slide => {
      const index = parseInt(
        slide.getAttribute(ATTRIBUTES.DATA_NUMBER) as string,
        10
      )
      return index > activeDataIndex
    })
  }

  protected getDataIndex(slide: HTMLElement): string {
    const dataIndex = slide.dataset.index

    return dataIndex ? dataIndex : "0"
  }

  protected getLastActiveIndex(slides: HTMLElement[]): number {
    let lastIndex = -1
    slides.forEach((slide, i) => {
      if (slide.classList.contains("active")) {
        lastIndex = i
      }
    })
    return lastIndex
  }
}

/*
  private getTotalWidth(): number {
    const { spacing } = this.store
    return this.slidesArr.reduce((total, slide) => {
      return total + slide.offsetWidth + spacing
    }, 0)
  }

*/
