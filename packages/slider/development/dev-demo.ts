// packages/slider/src/dev-demo.ts
import { BrickSlider } from "../src/BrickSlider"
import type { BrickSliderOptions } from "../src/types"
import { SLIDER_EVENTS } from "../src/helpers"
import {
  BrickSliderAccessibility,
  type BrickSliderAccessibilityOptions
} from "@sixsrc/brick-slider-accessibility"
import {
  BrickSliderStories,
  STORIES_EVENTS
} from "@sixsrc/brick-slider-stories"

type DemoSlideChangePayload = {
  rootSelector: string
  slideIndex: number
  activePage: number
}

function createInstance(
  selector: string,
  options: BrickSliderOptions,
  accessibilityOptions?: BrickSliderAccessibilityOptions
): BrickSlider {
  const slider = new BrickSlider(selector, options)
  const accessibilityPlugin = new BrickSliderAccessibility(accessibilityOptions)

  slider.use(accessibilityPlugin)

  return slider
}

function bindMethodsDemo(sliders: BrickSlider[]): void {
  const controls: Array<[string, () => void]> = [
    ["#methods-prev", () => sliders.forEach(slider => slider.prev())],
    ["#methods-next", () => sliders.forEach(slider => slider.next())],
    ["#methods-goto-0", () => sliders.forEach(slider => slider.goTo(0))],
    ["#methods-goto-2", () => sliders.forEach(slider => slider.goTo(2))],
    ["#methods-init", () => sliders.forEach(slider => slider.init())],
    ["#methods-destroy", () => sliders.forEach(slider => slider.destroy())]
  ]

  controls.forEach(([selector, action]) => {
    const element = document.querySelector<HTMLButtonElement>(selector)

    if (!element) return

    element.onclick = action
  })
}

function bindStoriesEventsPanel(
  slider: BrickSlider,
  stories: BrickSliderStories
): void {
  const controls: Array<[string, () => void]> = [
    ["#stories-events-open", () => stories.open()],
    ["#stories-events-close", () => stories.close()],
    ["#stories-events-destroy", () => slider.destroy()],
    ["#stories-events-init", () => slider.init()]
  ]

  controls.forEach(([selector, action]) => {
    const element = document.querySelector<HTMLButtonElement>(selector)

    if (!element) return

    element.onclick = action
  })
}

function bindStoriesMethodsDemo(
  slider: BrickSlider,
  stories: BrickSliderStories
): void {
  const controls: Array<[string, () => void]> = [
    ["#stories-methods-prev", () => slider.prev()],
    ["#stories-methods-next", () => slider.next()],
    ["#stories-methods-goto-0", () => slider.goTo(0)],
    ["#stories-methods-goto-2", () => slider.goTo(2)],
    ["#stories-methods-pause", () => stories.pause()],
    ["#stories-methods-resume", () => stories.resume()],
    ["#stories-methods-destroy", () => slider.destroy()],
    ["#stories-methods-init", () => slider.init()],
    ["#stories-methods-close", () => stories.close()]
  ]

  controls.forEach(([selector, action]) => {
    const element = document.querySelector<HTMLButtonElement>(selector)

    if (!element) return

    element.onclick = action
  })
}

function bindStoriesEventsDemo(slider: BrickSlider): void {
  slider.on(STORIES_EVENTS.OPENED, payload => {
    console.log("storiesOpened", payload as string)
  })

  slider.on(STORIES_EVENTS.MOUNTED, payload => {
    console.log("storiesMounted", payload as string)
  })

  slider.on(STORIES_EVENTS.CLOSED, payload => {
    console.log("storiesClosed", payload as string)
  })
}

function bindSlider3EventsDemo(slider: BrickSlider): void {
  slider.on(SLIDER_EVENTS.MOUNTED, () => {
    /* alert("slider3 mounted")*/
  })

  slider.on(SLIDER_EVENTS.DESTROYED, () => {
    /* alert("slider3 destroyed")*/
  })

  slider.on(SLIDER_EVENTS.SLIDE_CHANGE, payload => {
    const slideChangePayload = payload as DemoSlideChangePayload

    /* alert(
       `slider3 slideChange: slide ${slideChangePayload.slideIndex}, page ${slideChangePayload.activePage}`
     )*/
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
      sm: 540,
      md: 768,
      lg: 1024,
      xl: 1280
    },
    responsive: {
      xs: {
        slidesPerView: 1,
        slidesPerPage: 1
      },
      sm: {
        slidesPerView: 2,
        slidesPerPage: 1
      },
      md: {
        slidesPerView: 2,
        slidesPerPage: 2
      },
      lg: {
        slidesPerView: 3,
        slidesPerPage: 2
      },
      xl: {
        slidesPerView: 4,
        slidesPerPage: 4
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
      sm: 540,
      md: 768,
      lg: 1024,
      xl: 1280
    },
    responsive: {
      xs: {
        slidesPerView: 1,
        slidesPerPage: 1,
        useSlideSizes: false
      },
      sm: {
        slidesPerView: 2,
        slidesPerPage: 1,
        slideSizes: {
          0: 65,
          1: 35
        }
      },
      md: {
        slidesPerView: 2,
        slidesPerPage: 2,
        slideSizes: {
          0: 30,
          1: 70
        }
      },
      lg: {
        slidesPerView: 3,
        slidesPerPage: 2,
        slideSizes: {
          0: 50,
          1: 30,
          2: 20
        }
      },
      xl: {
        slidesPerView: 4,
        slidesPerPage: 4,
        slideSizes: {
          0: 38,
          1: 22,
          2: 20,
          3: 20
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

const slider3AccessibilityOptions: BrickSliderAccessibilityOptions = {
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
  const storiesPlugin = new BrickSliderStories({
    trigger: "#open-stories",
    duration: 5000,
    maxVideoDuration: 60000,
    maxStories: 3,
    closeOnEnd: false,
    pauseOnHover: true,
    useMuted: true
  })
  bindSlider3EventsDemo(slider3)
  bindStoriesEventsDemo(slider9)
  slider9.use(storiesPlugin)
  slider1.init()
  slider2.init()
  slider3.init()
  slider4.init()
  slider8.init()
  slider5.init()
  slider6.init()
  slider7.init()
  slider9.init()
  bindStoriesMethodsDemo(slider9, storiesPlugin)
  bindStoriesEventsPanel(slider9, storiesPlugin)
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
