import { getChildren, getChildrenCount, getSliderWidth } from "@/dom"
import { slideNodeList } from "@/util"
import { transform as transformSlider } from "@/transition/transform"
import { Slider, SetCurrentSlideType } from "@/core/Slider"
import { Slides } from "./Slides"
import { setSliderControls } from "@/action"

export interface ActionsMethods {
  getChildren(): HTMLElement
  getChildrenCount(): number
  getSlideNodeList(): HTMLElement[]
  getSliderWidth(): number
  setSliderControls(options: any): void
  setTransform(translate?: number): void
  setCurrentSlide(params: SetCurrentSlideType): void
  setSlideActiveCloned(): void
}

export class Actions implements ActionsMethods {
  public $root: string
  public slides: Slides
  public slider: Slider

  constructor($root: string) {
    this.$root = $root
    this.slides = new Slides(this.$root)
    this.slider = new Slider(this.$root)
  }

  public getChildren(): HTMLElement {
    return getChildren(this.$root)
  }

  public getChildrenCount(): number {
    return getChildrenCount(this.getChildren())
  }

  public getSlideNodeList(): HTMLElement[] {
    return slideNodeList(this.$root)
  }

  public getSliderWidth(): number {
    return getSliderWidth(this.getChildren())
  }

  public setSliderControls(options: any): void {
    return setSliderControls(this.$root, options)
  }

  public setTransform(translate?: number) {
    return transformSlider(this.$root, translate)
  }

  public setCurrentSlide(params: SetCurrentSlideType) {
    this.slider.setCurrentSlide(params)
  }

  public setSlideActiveCloned(): void {
    this.slides.cloneSlides()
  }
}
