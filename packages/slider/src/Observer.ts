import { BaseSlider } from "./BaseSlider"
import { Mutate } from "./Mutate"

export class Observer extends BaseSlider {
  private mutate: Mutate

  constructor($root: string) {
    super($root)
    this.mutate = new Mutate($root)
  }

  public targetSlide(mutations: MutationRecord[], applyTranslate: Function) {
    const { infinite } = this.store

    mutations.forEach(mutation => {
      if (infinite && this.targetMutation(mutation)) {
        const targetSlide = mutation.target as HTMLElement
        this.mutate.targetClass(targetSlide, applyTranslate)
      }
    })
  }

  private targetMutation(mutation: MutationRecord) {
    return mutation.type === "attributes" && mutation.attributeName === "class"
  }
}
