export { BrickSlider } from "./BrickSlider"
export { Plugin } from "./Plugin"
export type {
  AnimationCallbacks,
  AnimationOptions,
  ResponsiveBreakpoint,
  ResponsiveInput,
  ResponsiveOption,
  ResponsiveScreensInput,
  BrickSliderSlideChangePayload,
  SlideChangePayload,
  SlideSizesInput,
  BrickSliderOptions,
  SliderOptions
} from "./types"

if (import.meta.env.DEV) {
  import("../development/dev-demo")
    .then(m => {
      m.startDemo?.()
    })
    .catch(e => {
      console.warn("Failed to load dev-demo (dev only):", e)
    })
}
