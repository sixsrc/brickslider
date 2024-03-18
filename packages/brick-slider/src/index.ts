import { BrickSlider } from "./core/BrickSlider"
//;(window as any).BrickSlider = BrickSlider

const slider4 = new BrickSlider("#slide4_container", {
  infinite: false,
  slidesPerPage: 2,
  spacing: 20
})

const slider = new BrickSlider("#slide1_container", {
  infinite: true,
  spacing: 20
})

const slider2 = new BrickSlider("#slide2_container", {
  arrows: true,
  spacing: 20
})

const slider3 = new BrickSlider("#slide3_container", { spacing: 20 })

slider.init()
slider2.init()
slider3.init()
slider4.init()

export { BrickSlider }
