//export { BrickSlider } from "./BrickSlider"

/*
export { BrickSlider }
;(window as any).BrickSlider = BrickSlider
*/

import { BrickSlider } from "./BrickSlider"

const slider1 = new BrickSlider("#slider1", {
  spacing: 20,
  slidesPerView: 2,
  slidesPerPage: 2
})

const slider2 = new BrickSlider("#slider2", {
  spacing: 20,
  slidesPerView: 1,
  slidesPerPage: 1,
  infinite: false
})

const slider3 = new BrickSlider("#slider3", {
  spacing: 20,
  slidesPerView: 3,
  slidesPerPage: 2,
  infinite: true
})

/*
const slider3 = new BrickSlider("#slider3", {
  spacing: 20,
  slidesPerView: 3,
  slidesPerPage: 2,
  infinite: false
})


12 slides

*/

slider1.init()
slider2.init()
slider3.init()

export { BrickSlider }
