import { BaseSlider } from "./BaseSlider"
import { SLIDE_INDEX } from "./constants"
import { StateType } from "./State"
import { IndexData, IndexKey, IndexMap } from "./types"

export class HandleMovement extends BaseSlider {
  constructor($root: string) {
    super($root)
  }
  protected handleMove(): boolean | void {
    const { infinite } = this.store

    infinite && this.infiniteMove()
  }

  protected infiniteMove(): void {
    const isEqual = Object.keys(this.evalSlideConditions()).find(
      key => this.evalSlideConditions()[key]
    )

    if (isEqual) {
      this.jumpSlideTo(SLIDE_INDEX[isEqual as keyof typeof SLIDE_INDEX])
    }
  }

  protected mapIndex(): Map<IndexKey, IndexData> {
    const { slidesPerPage } = this.store
    const { FIRST, LAST } = SLIDE_INDEX
    const penultGroupIdx = Math.ceil(this.childrenCount / slidesPerPage) - 2
    const firstGroupIdx = 1

    return new Map([
      [
        FIRST,
        {
          currentIndex: LAST,
          translate: this.calcTranslate(penultGroupIdx)
        }
      ],
      [
        LAST,
        {
          currentIndex: FIRST,
          translate: this.calcTranslate(firstGroupIdx)
        }
      ]
    ])
  }

  protected getIndexes(): Record<IndexKey, number> {
    const { FIRST, LAST } = SLIDE_INDEX
    const { numberOfSlides } = this.store

    return {
      [FIRST]: 1,
      [LAST]: numberOfSlides
    }
  }

  protected evalSlideConditions(): Partial<StateType> {
    return {}
  }

  protected jumpSlideTo(_to: keyof IndexMap): void {}
}

/*
     // [SLIDE_INDEX.SECOND, { currentIndex: "Last", translate: lastIndex }],
*/
/*protected mapIndex(): Map<IndexKey, IndexData> {
    const { slidesPerPage } = this.store
    const penultIndex = this.calcTranslate(this.childrenCount - 2)
    const secondIndex = this.calcTranslate(1)
    const { FIRST, LAST } = SLIDE_INDEX

    console.log("asdasda", this.childrenCount, penultIndex)

    return new Map([
      [FIRST, { currentIndex: LAST, translate: penultIndex }],
      [LAST, { currentIndex: FIRST, translate: secondIndex }]
    ])
  }*/
