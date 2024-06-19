import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { addClass, eventX, getAxisX, removeClass, transform } from "./helpers"

export class TouchMove extends BaseSlider {
  private currentPosition: number
  private previousPosition: number
  private animation: AnimationFrame
  private skipSlide: boolean
  private currentIndex: number
  private translate: number

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
    this.currentPosition = 0
    this.previousPosition = 0
    this.currentIndex = 0
    this.translate = 0
    this.skipSlide = false
  }

  public init = (event: any): void => {
    const { isDragging } = this.store

    if (isDragging) {
      this.setState(event)
      this.getPosition(event)
      this.updateDOM()
    }
  }

  protected getPosition(event: Event) {
    this.previousPosition = this.currentPosition
    this.currentPosition = getAxisX(eventX(event as MouseEvent | TouchEvent))

    return {
      right: () => this.currentPosition > this.previousPosition,
      left: () => this.currentPosition < this.previousPosition
    }
  }

  protected setState(event: Event) {
    const position = this.getPosition(event)
    const { slideIndex, infinite } = this.store

    if(infinite){
      if (position.right() && slideIndex === 1) {
        this.skipSlide = true
        this.currentIndex = IndexesNames["Last"]
        this.translate = -2940
      }
    }

    this.state.set(
      this.skipSlide ? this.infiniteTouchState() : this.mainState()
    )

    this.skipSlide = false
  }

  protected mainState() {
    const { prevTranslate, startPos } = this.store

    return {
      isTouch: true,
      currentTranslate: prevTranslate + this.currentPosition - startPos
    }
  }

  protected infiniteTouchState() {
    return {
      slideIndex: this.currentIndex,
      prevTranslate: this.translate
    }
  }
  protected updateDOM() {
    const { currentTranslate, prevTranslate } = this.store

    // requestAnimationFrame(this.animation.init)
    // transform(this.$root, currentTranslate)

    console.log("prevtranslate", prevTranslate)
    /*
    
    this.$children.animate(
      [
        {
          transform: `translateX(${currentTranslate}px)`
        }
      ],

      {
        duration: 0,
        easing: "ease",
        fill: "forwards"
      }
    )
    */
  }
}

enum IndexesNames {
  First = 0,
  Second = 1,
  Third = 4,
  Last = 5
}
// Math.abs(this.store.currentTranslate) <= 588 - (588 * 3) / 100 //10 - 3- 30*/

/*

      if (position.right() && slideIndex === 1) {
        this.skipSlide = true
        this.currentIndex = IndexesNames["Last"]
      } else if (
        position.right() &&
        slideIndex === 5 //&&
        //!hasClass(this.slides[0], "cloned")
      ) 
        this.skipSlide = false

        //removeClass(this.$children, "no-transition")
      }*/
