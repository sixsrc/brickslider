import { BrickSlider } from "./BrickSlider"
import * as BrickSliderApi from "./api"

const browserGlobals = globalThis as typeof globalThis & {
  BrickSlider?: typeof BrickSlider
  BrickSliderApi?: typeof BrickSliderApi
}

browserGlobals.BrickSlider = BrickSlider
browserGlobals.BrickSliderApi = BrickSliderApi

export default BrickSlider
export { BrickSlider, BrickSliderApi }
