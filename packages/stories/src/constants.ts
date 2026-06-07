export const STORIES_CLASSES = {
  BODY_OPEN: "bs-stories-body-open",
  ROOT: "bs-stories",
  OPEN: "bs-stories--open",
  BACKDROP: "bs-stories-backdrop",
  SHELL: "bs-stories-shell",
  CLOSE: "bs-stories-close",
  MUTE: "bs-stories-mute",
  MUTED: "bs-stories-muted",
  PROGRESS: "bs-stories-progress",
  PROGRESS_ITEM: "bs-stories-progress-item",
  PROGRESS_BAR: "bs-stories-progress-bar",
  ACTIVE_PROGRESS: "bs-stories-progress-item--active",
  COMPLETED_PROGRESS: "bs-stories-progress-item--completed"
} as const

export const STORIES_STYLE_ID = "bs-stories-style"

export const STORIES_DEFAULTS = {
  DURATION: 5000,
  MAX_VIDEO_DURATION: 60000,
  MIN_VIDEO_DURATION: 1000,
  MAX_STORIES: 10,
  MAX_STORIES_LIMIT: 20
} as const
