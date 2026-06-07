export type StoriesTriggerInput = string | HTMLElement | HTMLElement[]

export type BSStoriesPluginOptions = Partial<{
  trigger: StoriesTriggerInput
  duration: number
  maxVideoDuration: number
  maxStories: number
  pauseOnHover: boolean
  useMuted: boolean
}>

export type ResolvedBSStoriesPluginOptions = {
  trigger?: StoriesTriggerInput
  duration: number
  maxVideoDuration: number
  maxStories: number
  pauseOnHover: boolean
  useMuted: boolean
}

export type StoryTimerState = {
  startedAt: number
  remaining: number
  duration: number
}
