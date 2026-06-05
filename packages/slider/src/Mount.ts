import { Arrows } from "./Arrows"
import { Dots } from "./Dots"
import { Resize } from "./Resize"
import { CloneSlides } from "./CloneSlides"
import { StateType } from "./State"
import { Swipe } from "./Swipe"
import { CLASS_VALUES } from "./helpers"
import {
  appendToParent,
  getChildrenCount,
  getSliderNodeList,
  getSliderWidth,
  hasClass,
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
  private mutate: Mutate
  private resolvedSlideWidths = new Map<number, string>()

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

  private setProperties(): void {
    this.slides.forEach((slide, index) => {
      setAttributes(slide, this.setAttr(index))
    })
  }
  private normalizeSlidesConfig(): void {
    const { slidesPerPage: originalPerPage, slidesPerView: originalPerView } =
      this.store
    const totalSlides = this.slidesArr.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    ).length

    if (originalPerView > totalSlides)
      this.setState({ slidesPerView: totalSlides })

    if (originalPerView + originalPerPage <= totalSlides) {
      this.setState({
        slidesPerPage: originalPerPage,
        slidesPerView: originalPerView
      })
      return
    }
  }

  private cloneSlides(): void {
    const { infinite } = this.store

    if (infinite) {
      this.clone.init()
      this.slides = BaseSlider.getSlides(this.$root)
    }
  }

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
    const slideWidth = this.getSlideWidth(index)
    const { spacing } = this.store

    return [
      {
        marginRight: `${spacing}px`,
        width: slideWidth,
        maxWidth: `100%`,
        boxSizing: "border-box"
      }
    ]
  }

  private getDefaultSlideWidth(): number {
    const { spacing, slidesPerView, sliderWidth } = this.store
    const totalSpacing = (slidesPerView - 1) * spacing
    const availableWidth = sliderWidth - totalSpacing
    const slideWidth = availableWidth / slidesPerView

    return Math.max(0, slideWidth)
  }

  // Usa `data-index` para que clones recebam o mesmo tamanho percentual do
  // slide original. Se não houver `slideSizes`, mantém a largura padrão.
  private getSlideWidth(index: number): string {
    const slide = this.slides[index]
    const slidePosition = this.getSlidePosition(slide, index)

    if (!this.hasCustomSlideSizes()) {
      return `${this.getDefaultSlideWidth()}px`
    }

    if (!this.resolvedSlideWidths.has(slidePosition)) {
      this.resolveGroupWidths(slidePosition)
    }

    return (
      this.resolvedSlideWidths.get(slidePosition) ??
      `${this.getDefaultSlideWidth()}px`
    )
  }

  private getSlidePosition(
    slide: HTMLElement | undefined,
    fallback: number
  ): number {
    const dataIndex = Number(slide?.dataset.index)

    if (Number.isInteger(dataIndex) && dataIndex > 0) {
      return dataIndex - 1
    }

    return fallback
  }

  private hasCustomSlideSizes(): boolean {
    return Object.keys(this.store.slideSizes ?? {}).length > 0
  }

  // Ajusta os percentuais do grupo visível para nunca estourar o viewport.
  // Se a soma passar de 100, tudo é reduzido proporcionalmente.
  private resolveGroupWidths(position: number): void {
    const groupPositions = this.getGroupPositions(position)
    const customSizes = this.store.slideSizes ?? {}
    const customEntries = groupPositions
      .filter(groupPosition => typeof customSizes[groupPosition] === "number")
      .map(groupPosition => [groupPosition, customSizes[groupPosition]] as const)

    if (customEntries.length === 0) return

    const customTotal = customEntries.reduce(
      (total, [, percentage]) => total + percentage,
      0
    )
    const scale = customTotal > 100 ? 100 / customTotal : 1
    const normalizedCustomTotal = customEntries.reduce(
      (total, [, percentage]) => total + percentage * scale,
      0
    )
    const remainingPercentage = Math.max(0, 100 - normalizedCustomTotal)
    const flexiblePositions = groupPositions.filter(
      groupPosition => customSizes[groupPosition] === undefined
    )
    const fallbackPercentage =
      flexiblePositions.length > 0
        ? remainingPercentage / flexiblePositions.length
        : 0
    const availableWidth = this.getAvailableWidth()

    groupPositions.forEach(groupPosition => {
      const customPercentage = customSizes[groupPosition]
      const percentage =
        customPercentage === undefined
          ? fallbackPercentage
          : customPercentage * scale

      this.resolvedSlideWidths.set(
        groupPosition,
        `${(availableWidth * percentage) / 100}px`
      )
    })
  }

  private getGroupPositions(position: number): number[] {
    const slidesPerView = this.store.slidesPerView || 1
    const totalSlides = BaseSlider.getSlides(this.$root, false).length
    const groupStart = Math.floor(position / slidesPerView) * slidesPerView
    const groupEnd = Math.min(groupStart + slidesPerView, totalSlides)

    return Array.from(
      { length: Math.max(0, groupEnd - groupStart) },
      (_, index) => groupStart + index
    )
  }

  private getAvailableWidth(): number {
    const { spacing, slidesPerView, sliderWidth } = this.store
    const totalSpacing = Math.max(0, (slidesPerView - 1) * spacing)

    return Math.max(0, sliderWidth - totalSpacing)
  }

  private mountState(): Partial<StateType> {
    const { $children } = this
    const sliderWidth = getSliderWidth($children!)

    // Mantém a largura interna da instância em sincronia com a largura real
    // usada pelo resize para que o clamp do translate não use valor antigo.
    this.sliderWidth = sliderWidth

    return {
      sliderWidth,
      numberOfSlides: getChildrenCount($children)
    }
  }

  private handleResize(): void {
    this.resize.init(() => this.syncSlidesWidthOnResize())
  }

  // Recalcula apenas a largura dos slides quando o container muda de tamanho.
  // Aqui não mexemos no translate para não afetar navegação/infinite.
  private syncSlidesWidthOnResize(): void {
    const preservedSlideIndex = this.getPreservedSlideIndexOnResize()

    this.setState({
      ...this.mountState(),
      slideIndex: preservedSlideIndex
    })
    this.applyResolvedWidthsOnResize()

    // Segundo passe curto para estabilizar os cálculos após o browser aplicar
    // as novas larguras do container em tempo real.
    waitFor(0, () => this.applyResolvedWidthsOnResize())
  }

  private getPreservedSlideIndexOnResize(): number {
    return typeof this.store.slideIndex === "number" ? this.store.slideIndex : 0
  }

  private applyResolvedWidthsOnResize(): void {
    this.resolvedSlideWidths.clear()
    this.setSlidesWidth()
    this.syncTranslateOnResize()
  }

  // Quando o slider já está em um dot avançado, o resize muda a largura real
  // dos slides e o translate antigo deixa de representar o mesmo grupo visível.
  // Aqui recompomos o translate a partir do `slideIndex` atual.
  private syncTranslateOnResize(): void {
    const translate = this.calcTranslateFromCurrentIndex()

    console.log("[BrickSlider][Resize][syncTranslate]", {
      root: this.$root,
      slideIndex: this.store.slideIndex,
      currentTranslateBefore: this.store.currentTranslate,
      prevTranslateBefore: this.store.prevTranslate,
      nextTranslate: -translate,
      sliderWidth: this.store.sliderWidth,
      spacing: this.store.spacing,
      slidesPerView: this.store.slidesPerView,
      slidesPerPage: this.store.slidesPerPage
    })

    this.setState({
      prevTranslate: -translate,
      currentTranslate: -translate
    })

    this.animate(this.$children, super.keyFrames(-translate), this.options(0))
    this.setActiveSlides()
  }

  private calcTranslateFromCurrentIndex(): number {
    const spacing = this.store.spacing || 0
    const index =
      typeof this.store.slideIndex === "number" ? this.store.slideIndex : 0
    let translate = 0
    const widthsBeforeIndex: number[] = []

    for (let i = 0; i < index; i++) {
      const slide = this.slides[i]

      if (slide) {
        widthsBeforeIndex.push(slide.offsetWidth)
        translate += slide.offsetWidth + spacing
      }
    }

    console.log("[BrickSlider][Resize][calcTranslate]", {
      root: this.$root,
      slideIndex: index,
      widthsBeforeIndex,
      spacing,
      rawTranslate: translate
    })

    return this.safeTranslate(translate)
  }

  private setVisibility(): void {
    removeClass(this.getRootSelector!, CLASS_VALUES.HIDE)
  }

  private setActiveSlides(): void {
    const visibleIndexes = this.getVisibleSlideIndexes()

    this.mutate.updateActiveSlides(visibleIndexes)
  }

  private setPeekStyle(): void {
    this.animate(this.$track, {} as any, this.options())
  }

  public setSlidesWidth(): void {
    this.resolvedSlideWidths.clear()

    this.slides.forEach((slide, index) => {
      this.animate(slide, this.keyFrames(index), this.options())
    })
  }

  private getVisibleSlideIndexes(): number[] {
    const slidesPerPage = this.store.slidesPerPage || 1
    const firstVisibleIndex =
      typeof this.store.slideIndex === "number" ? this.store.slideIndex : 0

    return Array.from(
      { length: slidesPerPage },
      (_, i) => firstVisibleIndex + i
    ).filter(index => index >= 0 && index < this.slides.length)
  }

  private endMount(): void {
    this.setActiveSlides()
    this.setPeekStyle()
    this.setSlidesWidth()
    this.setSlidesWidth()
    this.setVisibility()
    this.setControls()
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
