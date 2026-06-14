import { BaseSlider } from "./BaseSlider"
import {
  ATTRIBUTES,
  CLASS_VALUES,
  getAttribute,
  hasClass,
  removeAttribute,
  setAttribute
} from "./helpers"
import type { SlideMeta as SlideMetaType } from "./types"

export class SlideMeta extends BaseSlider {
  private static readonly metaMap = new WeakMap<HTMLElement, SlideMetaType>()
  private static readonly defaultValue = -1

  constructor($root: string) {
    super($root)
  }

  private toSafeInteger(value: unknown): number {
    const parsedValue = Number(value)

    if (!Number.isInteger(parsedValue)) {
      return SlideMeta.defaultValue
    }

    return parsedValue
  }

  private getStoredMeta(
    slide: HTMLElement | undefined
  ): SlideMetaType | undefined {
    if (!slide) return undefined

    return SlideMeta.metaMap.get(slide)
  }

  private getAttributeInteger(
    slide: HTMLElement | undefined,
    attribute: string
  ): number {
    const attributeValue = getAttribute(slide, attribute)

    return this.toSafeInteger(attributeValue)
  }

  public hasSlideMeta(slide: HTMLElement | undefined): boolean {
    return this.getStoredMeta(slide) !== undefined
  }

  public setSlideMeta(
    slide: HTMLElement,
    dataIndex: number,
    slideNumber: number,
    isCloned = false
  ): void {
    SlideMeta.metaMap.set(slide, {
      dataIndex,
      slideNumber,
      isCloned
    })

    setAttribute(slide, ATTRIBUTES.DATA_INDEX, String(dataIndex))
    removeAttribute(slide, ATTRIBUTES.DATA_NUMBER)
  }

  public syncSlideDataIndex(slide: HTMLElement, dataIndex: number): void {
    const currentSlideNumber = this.getSlideNumber(slide)

    SlideMeta.metaMap.set(slide, {
      dataIndex,
      slideNumber: currentSlideNumber,
      isCloned: this.getIsClonedSlide(slide)
    })

    setAttribute(slide, ATTRIBUTES.DATA_INDEX, String(dataIndex))
    removeAttribute(slide, ATTRIBUTES.DATA_NUMBER)
  }

  public syncSlideNumber(slide: HTMLElement, slideNumber: number): void {
    const currentDataIndex = this.getSlideDataIndex(slide)

    SlideMeta.metaMap.set(slide, {
      dataIndex: currentDataIndex,
      slideNumber,
      isCloned: this.getIsClonedSlide(slide)
    })

    removeAttribute(slide, ATTRIBUTES.DATA_NUMBER)
  }

  public getSlideDataIndex(slide: HTMLElement | undefined): number {
    const storedMeta = this.getStoredMeta(slide)

    if (storedMeta) return storedMeta.dataIndex

    return this.getAttributeInteger(slide, ATTRIBUTES.DATA_INDEX)
  }

  public getSlideNumber(slide: HTMLElement | undefined): number {
    const storedMeta = this.getStoredMeta(slide)

    if (storedMeta) return storedMeta.slideNumber

    return this.getAttributeInteger(slide, ATTRIBUTES.DATA_NUMBER)
  }

  public getSlideRealIndex(slide: HTMLElement | undefined): number {
    return this.getSlideDataIndex(slide)
  }

  public restoreSlideDataIndexAttribute(
    slide: HTMLElement | undefined
  ): void {
    const storedMeta = this.getStoredMeta(slide)

    if (!slide || !storedMeta) return

    setAttribute(slide, ATTRIBUTES.DATA_INDEX, String(storedMeta.dataIndex))
  }

  public getIsClonedSlide(slide: HTMLElement | undefined): boolean {
    const storedMeta = this.getStoredMeta(slide)

    if (!slide) return false
    if (storedMeta) return storedMeta.isCloned

    return hasClass(slide, CLASS_VALUES.CLONED)
  }
}
