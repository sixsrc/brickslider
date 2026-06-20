export const STORIES_CLASSES = {
  BODY_OPEN: "bs-stories-body-open",
  ROOT: "bs-stories",
  OPEN: "bs-stories--open",
  PAUSED: "bs-stories--paused",
  BACKDROP: "bs-stories-backdrop",
  SHELL: "bs-stories-shell",
  LAYER: "bs-stories-layer",
  CLOSE: "bs-stories-close",
  MUTE: "bs-stories-mute",
  MUTED: "bs-stories-muted",
  MUTE_DISABLED: "bs-stories-mute--disabled",
  MUTE_ON: "bs-stories-mute-on",
  MUTE_OFF: "bs-stories-mute-off",
  HIDDEN: "hidden",
  ROOT_HIDDEN: "hidden",
  LAYER_HIDDEN: "hidden",
  CONTROL_VISIBLE: "bs-stories-pause-indicator--visible",
  PAUSE: "bs-stories-pause",
  PLAY: "bs-stories-play",
  PAUSE_INDICATOR: "bs-stories-pause-indicator",
  PROGRESS: "bs-stories-progress",
  PROGRESS_ITEM: "bs-stories-progress-item",
  PROGRESS_BAR: "bs-stories-progress-bar",
  ACTIVE_PROGRESS: "bs-stories-progress-item--active",
  COMPLETED_PROGRESS: "bs-stories-progress-item--completed"
} as const

export const STORIES_ICONS = {
  CLOSE: "×",
  MUTE_ON:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12zm-2.5-8.7v2.1A7.5 7.5 0 0 1 18.5 12a7.5 7.5 0 0 1-4.5 6.6v2.1A9.5 9.5 0 0 0 20.5 12 9.5 9.5 0 0 0 14 3.3z"/></svg>',
  MUTE_OFF:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm10.59 3L12 9.41 13.41 8 16 10.59 18.59 8 20 9.41 17.41 12 20 14.59 18.59 16 16 13.41 13.41 16 12 14.59 14.59 12z"/></svg>',
  PAUSE:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h3v12H8zM13 6h3v12h-3z"/></svg>',
  PLAY:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
} as const

export const STORIES_LABELS = {
  CLOSE: "Close stories",
  MUTE: "Toggle sound",
  MUTE_ON: "Mute story sound",
  MUTE_OFF: "Unmute story sound",
  PAUSE: "Toggle pause"
} as const

export const STORIES_KEYBOARD_KEYS = {
  SPACE: " ",
  ESCAPE: "Escape",
  TAB: "Tab"
} as const

export const STORIES_EVENTS = {
  OPENED: "storiesOpened",
  MOUNTED: "storiesMounted",
  CLOSED: "storiesClosed"
} as const

export const STORIES_DEFAULTS = {
  DURATION: 5000,
  MAX_VIDEO_DURATION: 60000,
  MIN_VIDEO_DURATION: 1000,
  MAX_STORIES: 10,
  MAX_STORIES_LIMIT: 20,
  CLOSE_ON_END: true
} as const

export const STORIES_DOCS = {
  MARKUP: "https://sixsrc.github.io/brickslider/docs/stories-plugin/"
} as const
