//export { BrickSlider } from "./BrickSlider"

/*
export { BrickSlider }
;(window as any).BrickSlider = BrickSlider
*/

import { BrickSlider } from "./BrickSlider"

const slider1 = new BrickSlider("#slider1", {
  spacing: 20,
  slidesPerView: 7,
  slidesPerPage: 1
})

const slider2 = new BrickSlider("#slider2", {
  spacing: 20,
  slidesPerView: 1,
  slidesPerPage: 1,
  infinite: true
})

slider1.init()
slider2.init()

export { BrickSlider }
