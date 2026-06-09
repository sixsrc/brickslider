export type BrickSliderStoriesSlideChangePayload = {
  slideIndex?: number
  activePage?: number
}

export type StorySlideChangePayload = BrickSliderStoriesSlideChangePayload

export type BrickSliderStoriesValidationId =
  | "DUPLICATE_STORIES_ELEMENTS"
  | "INVALID_TRACK_CHILD_ORDER"
  | "INVALID_PROGRESS_POSITION"
  | "INVALID_PROGRESS_STRUCTURE"
  | "INVALID_PAUSE_POSITION"
  | "INVALID_LAYER_POSITION"
  | "INVALID_BACKDROP_POSITION"
  | "INVALID_CLOSE_POSITION"
  | "INVALID_MUTE_POSITION"
  | "MULTIPLE_VIDEOS_IN_STORY"

export type StoriesValidationId = BrickSliderStoriesValidationId

export type StoriesTriggerInput = string | HTMLElement | HTMLElement[]

export type BSStoriesPluginOptions = Partial<{
  trigger: StoriesTriggerInput
  duration: number
  maxVideoDuration: number
  maxStories: number
  pauseOnHover: boolean
  closeOnEnd: boolean
  useMuted: boolean
}>

export type BrickSliderStoriesOptions = BSStoriesPluginOptions

export type ResolvedBSStoriesPluginOptions = {
  trigger?: StoriesTriggerInput
  duration: number
  maxVideoDuration: number
  maxStories: number
  pauseOnHover: boolean
  closeOnEnd: boolean
  useMuted: boolean
}

export type ResolvedBrickSliderStoriesOptions = ResolvedBSStoriesPluginOptions

export type StoryTimerState = {
  startedAt: number
  remaining: number
  duration: number
}

export type BrickSliderStoriesHostMethods = {
  next: () => void
  prev: () => void
  goTo: (index: number) => void
}
