// packages/slider/src/dev-demo.ts
import { BrickSlider } from "../src/BrickSlider"
import type { SliderOptions } from "../src/types"
import { SLIDER_EVENTS } from "../src/helpers"
import {
  BSAccessibilityPlugin,
  type BSAccessibilityPluginOptions
} from "@sixsrc/brickslider-accessibility"
import { BSStoriesPlugin } from "@sixsrc/brickslider-stories"

type DemoSlideChangePayload = {
  slideIndex: number
  activePage: number
}

function createInstance(
  selector: string,
  options: SliderOptions,
  accessibilityOptions?: BSAccessibilityPluginOptions
): BrickSlider {
  const slider = new BrickSlider(selector, options)
  const accessibilityPlugin = new BSAccessibilityPlugin(
    selector,
    accessibilityOptions
  )

  slider.use(accessibilityPlugin)

  return slider
}

function bindMethodsDemo(sliders: BrickSlider[]): void {
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

function bindSlider3EventsDemo(slider: BrickSlider): void {
  slider.on(SLIDER_EVENTS.MOUNTED, () => {
    alert("slider3 mounted")
  })

  slider.on(SLIDER_EVENTS.DESTROYED, () => {
    alert("slider3 destroyed")
  })

  slider.on(SLIDER_EVENTS.SLIDE_CHANGE, payload => {
    const slideChangePayload = payload as DemoSlideChangePayload

    alert(
      `slider3 slideChange: slide ${slideChangePayload.slideIndex}, page ${slideChangePayload.activePage}`
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
        slidesPerPage: 1
      },
      md: {
        slidesPerView: 2,
        slidesPerPage: 2
      },
      lg: {
        slidesPerView: 3,
        slidesPerPage: 3
      }
    },
    useLoop: true
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
  },
  {
    slidesPerView: 1,
    slidesPerPage: 1,
    gap: 0,
    useLoop: false
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

export function startDemo(): void {
  const slider1 = createInstance("#slider1", options[0])
  const slider2 = createInstance("#slider2", options[1])
  const slider3 = createInstance(
    "#slider3",
    options[2],
    slider3AccessibilityOptions
  )
  const slider4 = createInstance("#slider4", options[3])
  const slider8 = createInstance("#slider8", options[4])
  const slider5 = createInstance("#slider5", options[5])
  const slider6 = createInstance("#slider6", options[6])
  const slider7 = createInstance("#slider7", options[7])
  const slider9 = createInstance("#slider9", options[8])
  const storiesPlugin = new BSStoriesPlugin("#slider9", {
    trigger: "#open-stories",
    duration: 5000,
    maxVideoDuration: 60000,
    maxStories: 10,
    pauseOnHover: true,
    useMuted: true
  })

  // bindSlider3EventsDemo(slider3)
  slider1.init()
  slider2.init()
  slider3.init()
  slider4.init()
  slider8.init()
  slider5.init()
  slider6.init()
  slider7.init()
  slider9.init()
  slider9.use(storiesPlugin)
  bindMethodsDemo([
    slider1,
    slider2,
    slider3,
    slider4,
    slider8,
    slider5,
    slider6,
    slider7
  ])
}
