import { Arrows } from "./Arrows"
import { Dots } from "./Dots"
import { Resize } from "./Resize"
import { CloneSlides } from "./CloneSlides"
import { StateType } from "./State"
import { Swipe } from "./Swipe"
import { CLASS_VALUES, EVENTS } from "./constants"
import {
  appendToParent,
  getChildrenCount,
  getSliderNodeList,
  getSliderWidth,
  hasClass,
  listener,
  removeClass,
  setAttributes,
  waitFor
} from "./helpers"
import { Attributes, KeyframeAnimation } from "./types"
import { ContextMenu } from "./ContextMenu"
import { BaseSlider } from "./BaseSlider"
import { Mutate } from "./Mutate"

export class Mount extends BaseSlider {
  private clonedSlides: HTMLElement[] = []
  private resize: Resize
  private clone: CloneSlides
  private slides: HTMLElement[]
  private mutate: Mutate

  constructor($root: string) {
    super($root)
    this.slides = getSliderNodeList(this.$root)
    this.clone = new CloneSlides(this.$root)
    this.resize = new Resize(this.$root)
    this.mutate = new Mutate($root)
  }

  public init(): void {
    this.setState(this.mountState())
    this.normalizeSlidesConfig()
    this.setProperties()
    this.cloneSlides()
    this.appendSlider()
    this.handleResize()
    this.endMount()
  }

  /*private normalizeSlidesConfig(): void {
    const { slidesPerPage: originalPerPage, slidesPerView: originalPerView } =
      this.store
    const totalSlides = this.slidesArr.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    ).length
    let adjustedPerPage = 0

    if (totalSlides <= originalPerView) {
      this.setState({
        slidesPerPage: totalSlides,
        slidesPerView: totalSlides
      })
      return
    }

    adjustedPerPage = originalPerPage

    if (totalSlides <= originalPerPage) adjustedPerPage = totalSlides
    else {
      const remainingSlides = totalSlides % originalPerPage

      if (remainingSlides > 0 && remainingSlides < originalPerView) {
        adjustedPerPage = Math.floor(
          totalSlides / Math.ceil(totalSlides / originalPerPage)
        )

        adjustedPerPage = Math.max(adjustedPerPage, originalPerView)

        if (
          totalSlides -
            Math.floor(totalSlides / adjustedPerPage) * adjustedPerPage <
          originalPerView
        ) {
          const pagesNeeded =
            Math.ceil((totalSlides - originalPerView) / originalPerPage) + 1
          adjustedPerPage = Math.ceil(
            (totalSlides - originalPerView) / (pagesNeeded - 1)
          )
          adjustedPerPage = Math.max(adjustedPerPage, 1)
        }
      }
    }

    this.setState({
      slidesPerPage: adjustedPerPage,
      slidesPerView: originalPerView
    })
  }*/

  /*  private normalizeSlidesConfig(): void {
    const {
      infinite,
      slidesPerPage: originalPerPage,
      slidesPerView: originalPerView
    } = this.store

    // Filtra apenas slides reais (não clonados)
    const totalSlides = this.slidesArr.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    ).length

    if (originalPerPage > originalPerView) {
      this.setState({ isSlidesPerPageAdjusted: true })
    }

    // Se o total de slides for menor ou igual ao slidesPerView
    if (totalSlides <= originalPerView) {
      this.setState({
        slidesPerPage: totalSlides,
        slidesPerView: totalSlides
      })
      return
    }

    // CONDIÇÃO PRINCIPAL: só normaliza se a soma ultrapassar o total de slides
    if (originalPerView + originalPerPage <= totalSlides) {
      // Configuração é válida, mantém os valores originais
      this.setState({
        slidesPerPage: originalPerPage,
        slidesPerView: originalPerView
      })
      return
    }

    // Se chegou até aqui, precisa normalizar porque slidesPerView + slidesPerPage > totalSlides
    // A fórmula é simples: o máximo que podemos avançar garantindo que sobre slidesPerView
    let adjustedPerPage = totalSlides - originalPerView

    // Garante que seja pelo menos 1
    adjustedPerPage = Math.max(adjustedPerPage, 1)

    this.setState({
      slidesPerPage: adjustedPerPage,
      slidesPerView: originalPerView
    })

    console.log(
      "normalizeSlidesConfig:",
      "slidesPerPage =",
      this.store.slidesPerPage,
      "slidesPerView =",
      this.store.slidesPerView,
      "totalSlides =",
      totalSlides,
      "soma =",
      originalPerView + originalPerPage,
      "needsNormalization =",
      originalPerView + originalPerPage > totalSlides
    )
  }*/

  private normalizeSlidesConfig(): void {
    const {
      infinite,
      slidesPerPage: originalPerPage,
      slidesPerView: originalPerView
    } = this.store

    // Filtra apenas slides reais (não clonados)
    const totalSlides = this.slidesArr.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    ).length

    if (originalPerPage > originalPerView) {
      this.setState({ isSlidesPerPageAdjusted: true })
    }

    // Se o total de slides for menor ou igual ao slidesPerView
    if (totalSlides <= originalPerView) {
      this.setState({
        slidesPerPage: totalSlides,
        slidesPerView: totalSlides
      })
      return
    }

    // NOVA LÓGICA: Verificar se haverá sobras e ajustar
    const remainingSlides = totalSlides - originalPerView
    const fullPages = Math.floor(remainingSlides / originalPerPage)
    const remainder = remainingSlides % originalPerPage

    // Se há sobras e slidesPerPage > slidesPerView, ajustar para eliminar sobras
    if (remainder > 0 && originalPerPage > originalPerView) {
      // Calcular novo slidesPerPage que elimine as sobras
      // Opção 1: Ajustar para cima (mais conservador)
      const adjustedPerPageUp = Math.ceil(remainingSlides / fullPages)

      // Opção 2: Ajustar para baixo
      const adjustedPerPageDown =
        fullPages > 0
          ? Math.floor(remainingSlides / fullPages)
          : remainingSlides

      // Escolher o ajuste que fique mais próximo do original e seja >= slidesPerView
      let adjustedPerPage
      if (
        adjustedPerPageUp >= originalPerView &&
        adjustedPerPageDown >= originalPerView
      ) {
        // Se ambos são válidos, escolher o mais próximo do original
        const diffUp = Math.abs(adjustedPerPageUp - originalPerPage)
        const diffDown = Math.abs(adjustedPerPageDown - originalPerPage)
        adjustedPerPage =
          diffUp <= diffDown ? adjustedPerPageUp : adjustedPerPageDown
      } else if (adjustedPerPageUp >= originalPerView) {
        adjustedPerPage = adjustedPerPageUp
      } else if (adjustedPerPageDown >= originalPerView) {
        adjustedPerPage = adjustedPerPageDown
      } else {
        // Fallback: usar o valor mínimo permitido
        adjustedPerPage = originalPerView
      }

      this.setState({
        slidesPerPage: adjustedPerPage,
        slidesPerView: originalPerView
      })

      console.log(
        "normalizeSlidesConfig (sobras eliminadas):",
        "slidesPerPage ajustado =",
        adjustedPerPage,
        "slidesPerView =",
        originalPerView,
        "totalSlides =",
        totalSlides,
        "sobras eliminadas =",
        remainder,
        "páginas completas =",
        Math.floor((totalSlides - originalPerView) / adjustedPerPage)
      )
      return
    }

    // CONDIÇÃO ORIGINAL: só normaliza se a soma ultrapassar o total de slides
    if (originalPerView + originalPerPage <= totalSlides) {
      // Configuração é válida, mantém os valores originais
      this.setState({
        slidesPerPage: originalPerPage,
        slidesPerView: originalPerView
      })
      return
    }

    // Se chegou até aqui, precisa normalizar porque slidesPerView + slidesPerPage > totalSlides
    // A fórmula é simples: o máximo que podemos avançar garantindo que sobre slidesPerView
    let adjustedPerPage = totalSlides - originalPerView
    // Garante que seja pelo menos 1
    adjustedPerPage = Math.max(adjustedPerPage, 1)

    this.setState({
      slidesPerPage: adjustedPerPage,
      slidesPerView: originalPerView
    })

    console.log(
      "normalizeSlidesConfig (normalização padrão):",
      "slidesPerPage =",
      this.store.slidesPerPage,
      "slidesPerView =",
      this.store.slidesPerView,
      "totalSlides =",
      totalSlides,
      "soma =",
      originalPerView + originalPerPage,
      "needsNormalization =",
      originalPerView + originalPerPage > totalSlides
    )
  }
  private setProperties(): void {
    this.slides.forEach((slide, index) => {
      setAttributes(slide, this.setAttr(index))
    })
  }

  private cloneSlides(): void {
    const { infinite } = this.store

    if (infinite) {
      this.clone.init()
      this.slides = BaseSlider.getSlides(this.$root)
    }
  }

  /*private setAttr(index: number): Attributes {
    const { numberOfSlides } = this.store

    return {
      "aria-label": `slide ${index + 1} of ${numberOfSlides}`,
      "aria-hidden": "true",
      "data-index": index + 1,
      "data-slide-number": index + 1,
      role: "group"
    }
  }*/

  private setAttr(index: number): Attributes {
    const { numberOfSlides } = this.store
    return {
      "aria-label": `slide ${index + 1} of ${numberOfSlides}`,
      "aria-hidden": "true",
      "data-index": index + 1,
      "data-slide-number": index + 1,
      role: "group"
    }
  }

  private appendSlider(): void {
    const { $children } = this

    this.clonedSlides.forEach((element: HTMLElement | undefined) => {
      appendToParent($children, element)
    })
  }

  private setControls(): void {
    const { dots, arrows, touch } = this.store
    const { $root } = this

    if ($root) new ContextMenu($root).init()
    if (dots) new Dots($root).init()
    if (arrows) new Arrows($root).init()
    if (touch) new Swipe($root).init()
  }

  protected keyFrames(index: number): KeyframeAnimation[] {
    const slideWidth = this.getSlideWidth()
    const { spacing } = this.store

    return [
      {
        marginRight: `${spacing}px`,
        width: `${slideWidth}px`,
        maxWidth: `100%`,
        boxSizing: "border-box"
      }
    ]
  }

  private getSlideWidth(): number {
    const { spacing, slidesPerView, sliderWidth } = this.store
    const totalSpacing = (slidesPerView - 1) * spacing
    const availableWidth = sliderWidth - totalSpacing
    const slideWidth = availableWidth / slidesPerView

    return Math.max(0, slideWidth)
  }

  private mountState(): Partial<StateType> {
    const { $children } = this

    return {
      sliderWidth: getSliderWidth($children!),
      numberOfSlides: getChildrenCount($children)
    }
  }

  private handleResize(): void {
    listener([EVENTS.RESIZE], window, () => this.resize.init())
  }

  private setVisibility(): void {
    removeClass(this.getRootSelector!, CLASS_VALUES.HIDE)
  }

  private setActiveSlides(): void {
    const visibleIndexes = this.getVisibleSlideIndexes()
    const visibleDataIndexes = visibleIndexes.map(i => {
      const slide = this.slides[i]
      return Number(slide?.dataset.slideNumber)
    })

    this.mutate.updateActiveSlides(visibleDataIndexes)
  }

  private setActivePage(): void {}

  public setSlidesWidth(): void {
    this.slides.forEach((slide, index) => {
      this.animate(slide, this.keyFrames(index), this.options())
    })
  }

  private getVisibleSlideIndexes(): number[] {
    const slidesPerPage = this.store.slidesPerPage || 1
    const firstVisibleIndex = this.slides.findIndex(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    )

    return Array.from(
      { length: slidesPerPage },
      (_, i) => firstVisibleIndex + i
    )
  }

  private endMount(): void {
    this.setActiveSlides()
    this.setSlidesWidth()
    this.setVisibility()
    this.setControls()
  }
}
