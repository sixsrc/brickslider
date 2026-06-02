// packages/slider/src/dev-demo.ts
import { BrickSlider } from "../src/BrickSlider"

function createInstance(selector: string, options: Record<string, any>) {
  const slider = new BrickSlider(selector, options)

  return slider
}

const options = [
  {
    slidesPerView: 2,
    slidesPerPage: 2,
    infinite: false
  },
  {
    slidesPerView: 1,
    slidesPerPage: 1,
    infinite: false
  },
  {
    slidesPerView: 3,
    slidesPerPage: 2,
    spacing: 20,
    infinite: false
  }

  /*
  {
    slidesPerView: 3,
    slidesPerPage: 10,
    spacing: 20,
    infinite: true
  }
  */
]

export function startDemo() {
  const slider1 = createInstance("#slider1", options[0])
  const slider2 = createInstance("#slider2", options[1])
  const slider3 = createInstance("#slider3", options[2])

  slider1.init()
  slider2.init()
  slider3.init()
}
