/* eslint-disable @typescript-eslint/no-explicit-any */

import { Touch } from "../../event/Touch"
import { Arrows } from "../../ui/Arrows"
import { Dots } from "../../ui/Dots"

export function initSliderControls(this: any, $root: string, options: any): void {
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
