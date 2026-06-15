import { getDotsContainer, getPagesContainer, getProgressContainer } from "./helpers"
import type { StateType } from "./types"

let dotsModulePromise: Promise<typeof import("./Dots")> | null = null
let pagesModulePromise: Promise<typeof import("./Pages")> | null = null
let progressModulePromise: Promise<typeof import("./Progress")> | null = null
let arrowsModulePromise: Promise<typeof import("./Arrows")> | null = null
let swipeModulePromise: Promise<typeof import("./Swipe")> | null = null

function loadDotsModule(): Promise<typeof import("./Dots")> {
  dotsModulePromise ??= import("./Dots")
  return dotsModulePromise
}

function loadPagesModule(): Promise<typeof import("./Pages")> {
  pagesModulePromise ??= import("./Pages")
  return pagesModulePromise
}

function loadProgressModule(): Promise<typeof import("./Progress")> {
  progressModulePromise ??= import("./Progress")
  return progressModulePromise
}

function loadArrowsModule(): Promise<typeof import("./Arrows")> {
  arrowsModulePromise ??= import("./Arrows")
  return arrowsModulePromise
}

function loadSwipeModule(): Promise<typeof import("./Swipe")> {
  swipeModulePromise ??= import("./Swipe")
  return swipeModulePromise
}

export async function initDotsFeature(
  $root: string,
  store: StateType
): Promise<void> {
  if (!store.dots || store.useDragFree || !getDotsContainer($root)) return

  const { Dots } = await loadDotsModule()

  new Dots($root).init()
}

export async function initPagesFeature($root: string): Promise<void> {
  if (!getPagesContainer($root)) return

  const { Pages } = await loadPagesModule()

  new Pages($root).init()
}

export async function syncPagesFeature($root: string): Promise<void> {
  if (!getPagesContainer($root)) return

  const { Pages } = await loadPagesModule()

  new Pages($root).sync()
}

export async function initProgressFeature($root: string): Promise<void> {
  if (!getProgressContainer($root)) return

  const { Progress } = await loadProgressModule()

  new Progress($root).init()
}

export async function syncProgressFeature($root: string): Promise<void> {
  if (!getProgressContainer($root)) return

  const { Progress } = await loadProgressModule()

  new Progress($root).sync()
}

export async function initArrowsFeature(
  $root: string,
  store: StateType
): Promise<void> {
  if (!store.arrows) return

  const { Arrows } = await loadArrowsModule()

  new Arrows($root).init()
}

export async function initSwipeFeature(
  $root: string,
  store: StateType
): Promise<void> {
  if (!store.touch) return

  const { Swipe } = await loadSwipeModule()

  await new Swipe($root).init()
}
