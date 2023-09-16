import { getChildren } from "@/core/functions/getChildren"
import { State, State_Keys } from "../../state/BrickState"
import { transform } from "../../transition/transform"
import { getPositionX } from "./functions/getPositionX"
//import { getFirstChildren } from "@/dom/methods/getFirstChildren"
//import { getLastChildren } from "@/dom/methods/getLastChildren"
import { RequestAnimationFrame } from "./RequestAnimationFrame"

export class TouchMove {
  state: State
  rootSelector: string
  slider: HTMLElement
  animation: RequestAnimationFrame

  constructor(rootSelector: string) {
    this.animation = new RequestAnimationFrame(rootSelector)
    this.state = new State(rootSelector)
    this.rootSelector = rootSelector
    this.slider = getChildren(this.rootSelector)
  }

  public init = (event: Event): void => {
    const { state, rootSelector, animation } = this

    const [isDragging, currentPosition, prevTranslate, startPos] = [
      state.get(State_Keys.isDragging),
      getPositionX(event),
      state.get(State_Keys.prevTranslate),
      state.get(State_Keys.startPos)
    ]

    if (isDragging) {
      const deltaX = currentPosition - startPos
      //const firstSlide = getFirstChildren(this.slider) as HTMLElement
      // const lastSlide = getLastChildren(this.slider)
      if (deltaX > 0) {
        // Movimento da esquerda para a direita
        // Execute ação desejada aqui.
        console.log("esquerda")
      } else if (deltaX < 0) {
        // Movimento da direita para a esquerda
        // Execute outra ação desejada aqui.
        /* if (
          state.get(State_Keys.SlideIndex) >=
          state.get(State_Keys.NumberOfSlides) - 1
        ) {
          this.slider.removeChild(firstSlide)
          this.slider.style.transform = "translateX(-1732px)"
          this.slider.appendChild(firstSlide)
        }*/
      }
      state.set(
        State_Keys.currentTranslate,
        prevTranslate + currentPosition - startPos
      )

      const setCurrentTranslate = state.get(State_Keys.currentTranslate)

      transform(rootSelector, setCurrentTranslate)

      requestAnimationFrame(animation.init)
    }
  }
}
