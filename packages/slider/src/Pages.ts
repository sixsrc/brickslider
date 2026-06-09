import { BaseSlider } from "./BaseSlider"
import { getPagesContainer, getSliderNodeList, hasClass } from "./helpers"
import { CLASS_VALUES } from "./helpers"

export class Pages extends BaseSlider {
  private containerPages: HTMLElement | undefined

  constructor($root: string) {
    super($root)
    this.containerPages = getPagesContainer($root)
  }

  public init(): void {
    this.sync()
  }

  public sync(): void {
    const containerPages = this.containerPages
    const { useDragFree } = this.store

    if (!containerPages) return
    if (useDragFree) {
      containerPages.textContent = ""
      return
    }

    containerPages.textContent = this.getPagesLabel()
  }

  private getPagesLabel(): string {
    const { activePage, numberOfPages, useDragFree, slideIndex } = this.store
    const safePages = this.getSafePagesCount(numberOfPages, useDragFree)
    const safePage = this.getSafeCurrentPage(
      activePage,
      safePages,
      useDragFree,
      slideIndex
    )

    return `${safePage}/${safePages}`
  }

  private getSafePagesCount(
    numberOfPages: number,
    useDragFree: boolean
  ): number {
    if (!useDragFree) return Math.max(1, numberOfPages || 0)

    const totalSlides = getSliderNodeList(this.$root, false).filter(slide => {
      return !hasClass(slide, CLASS_VALUES.CLONED)
    }).length

    return Math.max(1, totalSlides)
  }

  private getSafeCurrentPage(
    activePage: number,
    safePages: number,
    useDragFree: boolean,
    slideIndex: number
  ): number {
    if (!useDragFree) {
      const safeActivePage = Math.max(
        0,
        Math.min(activePage || 0, safePages - 1)
      )

      return safeActivePage + 1
    }

    const safeSlideIndex = Math.max(0, Math.min(slideIndex || 0, safePages - 1))

    return safeSlideIndex + 1
  }
}
