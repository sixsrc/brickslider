import { BrickSliderStories } from "./BSStoriesPlugin"

const browserGlobals = globalThis as typeof globalThis & {
  BrickSliderStories?: typeof BrickSliderStories
  BSStoriesPlugin?: typeof BrickSliderStories
  StoriesPlugin?: typeof BrickSliderStories
}

browserGlobals.BrickSliderStories = BrickSliderStories
browserGlobals.BSStoriesPlugin = BrickSliderStories
browserGlobals.StoriesPlugin = BrickSliderStories

export default BrickSliderStories
export { BrickSliderStories }
