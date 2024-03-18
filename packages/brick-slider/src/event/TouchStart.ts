import { State, StateType, State_Keys } from "@/state/BrickState"
import { AnimationFrame } from "./AnimationFrame"
import { STYLES } from "@/util/constants"
import { getChildren } from "@/dom/getChildren"
import { eventX } from "@/util/eventX"
import { setStyle } from "@/dom/setStyle"
import { adjustIndex } from "@/util/adjustIndex"
import { getPositionX } from "@/util/getPositionX"

export class TouchStart {
  public $root: string
  private $children: HTMLElement
  private state: State
  private animation: AnimationFrame
  private store: StateType

  constructor($root: string) {
    this.$root = $root
    this.$children = getChildren(this.$root)
    this.state = new State($root)
    this.store = State.store($root)
    this.animation = new AnimationFrame($root)
  }

  public init(): (event: Event) => void {
    return (event: Event) => {
      const { slidesPerPage } = this.store

      const setEvent = eventX(event as MouseEvent | TouchEvent)

      setStyle(this.$children, STYLES.TRANSITION, "")

      const index = this.state.get(State_Keys.SlideIndex)

      this.state.seti({
        [State_Keys.StartTime]: new Date().getMilliseconds(),
        [State_Keys.SlideIndex]: adjustIndex(index, slidesPerPage),
        [State_Keys.StartPos]: getPositionX(setEvent),
        [State_Keys.isDragging]: true,
        [State_Keys.IsMouseLeave]: false,
        [State_Keys.IsJumpSlide]: false,
        [State_Keys.AnimationID]: requestAnimationFrame(this.animation.init)
      })
    }
  }
}

/*

index: number
   if (
        (isInfinite && slidesPerPage <= 1 && slideIndex <= 0) ||
        (isInfinite && slidesPerPage <= 1 && slideIndex >= numberOfSlides + 1)
      ) {
        //state.set(State_Keys.SliderReady, false)
      }

      // const isSliderReady = state.get(State_Keys.SliderReady)

      //if (!isSliderReady) return

*/
