// packages/slider/src/dev-demo.ts
import { BrickSlider } from "../src/BrickSlider"
import {
  BSAccessibilityPlugin,
  type BSAccessibilityPluginOptions
} from "@sixsrc/brickslider-accessibility"

function createInstance(
  selector: string,
  options: Record<string, any>,
  accessibilityOptions?: BSAccessibilityPluginOptions
) {
  const slider = new BrickSlider(selector, options)
  const accessibilityPlugin = new BSAccessibilityPlugin(
    selector,
    accessibilityOptions
  )

  slider.use(accessibilityPlugin)

  return slider
}

function bindMethodsDemo(sliders: BrickSlider[]) {
  const controls: Array<[string, () => void]> = [
    ["#methods-prev", () => sliders.forEach(slider => slider.prev())],
    ["#methods-next", () => sliders.forEach(slider => slider.next())],
    ["#methods-goto-0", () => sliders.forEach(slider => slider.goTo(0))],
    ["#methods-goto-2", () => sliders.forEach(slider => slider.goTo(2))],
    ["#methods-destroy", () => sliders.forEach(slider => slider.destroy())]
  ]

  controls.forEach(([selector, action]) => {
    const element = document.querySelector<HTMLButtonElement>(selector)

    if (!element) return

    element.onclick = action
  })
}

function bindSlider3EventsDemo(slider: BrickSlider) {
  slider.on("mounted", () => {
    alert("slider3 mounted")
  })

  slider.on("destroyed", () => {
    alert("slider3 destroyed")
  })

  slider.on("slideChange", payload => {
    alert(
      `slider3 slideChange: slide ${payload.slideIndex}, page ${payload.activePage}`
    )
  })
}

const options = [
  {
    slidesPerView: 1,
    slidesPerPage: 1,
    gap: 20,
    useLoop: false
  },
  {
    slidesPerView: 3,
    slidesPerPage: 3,
    gap: 20,
    useLoop: true
  },
  {
    slidesPerView: 2,
    slidesPerPage: 2,
    gap: 20,
    slideSizes: {
      0: 65,
      1: 35,
      2: 25,
      3: 75,
      6: 55,
      7: 45
    },
    useLoop: true
  },
  {
    slidesPerView: 3,
    slidesPerPage: 2,
    gap: 20,
    useDragFree: true,
    useLoop: false
  },
  {
    slidesPerView: 1,
    slidesPerPage: 1,
    gap: 20,
    screens: {
      xs: 320,
      md: 768,
      lg: 1024
    },
    responsive: {
      xs: {
        slidesPerView: 1,
        slidesPerPage: 1,
        useSlideSizes: false
      },
      md: {
        slidesPerView: 2,
        slidesPerPage: 2,
        slideSizes: {
          0: 70,
          1: 30
        }
      },
      lg: {
        slidesPerView: 3,
        slidesPerPage: 3,
        slideSizes: {
          0: 50,
          1: 30,
          2: 20
        }
      }
    },
    useLoop: true
  },
  {
    slidesPerView: 2,
    slidesPerPage: 2,
    gap: 20,
    useLoop: true
  },
  {
    slidesPerView: 1,
    slidesPerPage: 1,
    gap: 20,
    useAutoHeight: true,
    useLoop: true
  }
]

const slider3AccessibilityOptions: BSAccessibilityPluginOptions = {
  useKeyboardNavigation: true,
  useFocusManagement: true,
  labels: {
    root: "Featured products carousel",
    pagination: "Featured products pagination",
    previousSlide: "Previous products",
    nextSlide: "Next products",
    slide: (slideNumber, totalSlides) =>
      `Product slide ${slideNumber} of ${totalSlides}`,
    page: pageNumber => `Go to products page ${pageNumber}`,
    liveRegionSingle: (slideNumber, totalSlides) =>
      `Showing product slide ${slideNumber} of ${totalSlides}.`,
    liveRegionRange: (firstSlideNumber, lastSlideNumber, totalSlides) =>
      `Showing product slides ${firstSlideNumber} to ${lastSlideNumber} of ${totalSlides}.`,
    liveRegionFallback: totalSlides =>
      `Carousel updated. ${totalSlides} product slides available.`
  }
}

export function startDemo() {
  const slider1 = createInstance("#slider1", options[0])
  const slider2 = createInstance("#slider2", options[1])
  const slider3 = createInstance(
    "#slider3",
    options[2],
    slider3AccessibilityOptions
  )
  const slider4 = createInstance("#slider4", options[3])
  const slider5 = createInstance("#slider5", options[4])
  const slider6 = createInstance("#slider6", options[5])
  const slider7 = createInstance("#slider7", options[6])

  // bindSlider3EventsDemo(slider3)
  slider1.init()
  slider2.init()
  slider3.init()
  slider4.init()
  slider5.init()
  slider6.init()
  slider7.init()
  bindMethodsDemo([
    slider1,
    slider2,
    slider3,
    slider4,
    slider5,
    slider6,
    slider7
  ])
}
