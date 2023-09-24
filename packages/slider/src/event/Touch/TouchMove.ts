import { State, State_Keys } from "../../state/BrickState"
import { transform } from "../../transition/transform"
import { getPositionX } from "./functions/getPositionX"
import { RequestAnimationFrame } from "./RequestAnimationFrame"
import { checkFirstSlideCloned } from "./functions/checkFirstSlideCloned"
import { matchStateOptions } from "@/util/matchStateOptions"
import { CLASS_VALUES, STYLES, TRANSITIONS, eventX, slideNodeList } from "@/util/constants"
import { hasClass } from "@/dom/methods/hasClass"
import { setStyle } from "@/dom/methods/setStyle"
import { getChildren } from "@/core/functions/getChildren"

export class TouchMove {
  $root: string
  state: State
  //slider: HTMLElement
  animation: RequestAnimationFrame

  constructor($root: string) {
    this.$root = $root
    this.state = new State($root)
    //this.slider = getChildren(this.$root)
    this.animation = new RequestAnimationFrame($root)
  }

  public init = (event: Event): void => {
    const { state, $root, animation } = this

    //const $children = getChildren(this.$root)

    //if (!state.get(State_Keys.SliderReady)) return

    /*if (state.get(State_Keys.SlideIndex) !== 0)
      setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)*/

    const setEvent = eventX(event as MouseEvent | TouchEvent)

    const isDragging = state.get(State_Keys.isDragging)
    const currentPosition = getPositionX(setEvent)
    const prevTranslate = state.get(State_Keys.prevTranslate)
    const startPos = state.get(State_Keys.startPos)
    const deltaX = currentPosition - startPos

    const firstSlide = slideNodeList($root)[0]
    const hasActiveClass = hasClass(firstSlide, CLASS_VALUES.ACTIVE)

    //setStyle($children, STYLES.TRANSITION, "")

    const currentTranslate = state.get(State_Keys.currentTranslate)
    const isFirstAndActive = currentTranslate <= 0 && hasActiveClass

    const inicio = Date.now()
    for (let i = 0; i < 1000000; i++) {}

    if (isDragging) {
      /* if (deltaX > 0 && isFirstAndActive) {
        matchStateOptions($root, { [State_Keys.Infinite]: true }, () => {
          checkFirstSlideCloned($root, slideNodeList($root))
          ///state.set(State_Keys.SliderReady, false)
          //setStyle($children, STYLES.TRANSITION, "")
        })
      }*/

      state.setMultipleState({
        [State_Keys.SliderReady]: true,
        [State_Keys.currentTranslate]: prevTranslate + currentPosition - startPos
      })

      const setCurrentTranslate = state.get(State_Keys.currentTranslate)

      transform($root, setCurrentTranslate)

      requestAnimationFrame(animation.init)
    }
  }
}
