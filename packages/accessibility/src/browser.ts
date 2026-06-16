import { BrickSliderAccessibility } from "./BrickSliderAccessibility"

const browserGlobals = globalThis as typeof globalThis & {
  BrickSliderAccessibility?: typeof BrickSliderAccessibility
  AccessibilityPlugin?: typeof BrickSliderAccessibility
}

browserGlobals.BrickSliderAccessibility = BrickSliderAccessibility
browserGlobals.AccessibilityPlugin = BrickSliderAccessibility

export default BrickSliderAccessibility
export { BrickSliderAccessibility }
