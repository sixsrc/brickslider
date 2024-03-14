import { Arrows, Dots } from "@/ui"
import { Touch } from "../event/Touch/initTouch"

export function setSliderControls(
  this: any,
  $root: string,
  options: any
): void {
  const { dots, arrows, touch } = options || {}

  if (dots) {
    new Dots($root).init()
  }

  if (arrows) {
    new Arrows($root).init()
  }

  if (touch) {
    new Touch($root).init()
  }
}
