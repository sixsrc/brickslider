const STYLE_IDS = {
  CORE: "stories-inline-core-style",
  SHARED: "stories-inline-shared-style"
}

const SCRIPT_IDS = {
  TAILWIND: "stories-inline-tailwind-script",
  CORE: "stories-inline-core-script",
  STORIES: "stories-inline-stories-script",
  ACCESSIBILITY: "stories-inline-accessibility-script"
}

function ensureStyles() {
  const styles = [
    {
      id: STYLE_IDS.CORE,
      href: "https://cdn.jsdelivr.net/npm/@sixsrc/brick-slider@1.0.18/lib/brick-slider.css"
    },
    {
      id: STYLE_IDS.SHARED,
      href: "../../examples/shared.css"
    }
  ]

  styles.forEach(({ id, href }) => {
    if (document.getElementById(id)) return

    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href = href
    document.head.appendChild(link)
  })
}

function loadScript({ id, src }) {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id)

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve()
        return
      }

      existing.addEventListener("load", () => resolve(), { once: true })
      existing.addEventListener(
        "error",
        () => reject(new Error(`Failed to load ${src}`)),
        { once: true }
      )
      return
    }

    const script = document.createElement("script")
    script.id = id
    script.src = src
    script.async = false
    script.onload = () => {
      script.dataset.loaded = "true"
      resolve()
    }
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(script)
  })
}

async function ensureScripts() {
  await loadScript({
    id: SCRIPT_IDS.TAILWIND,
    src: "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"
  })
  await loadScript({
    id: SCRIPT_IDS.CORE,
    src: "https://cdn.jsdelivr.net/npm/@sixsrc/brick-slider@1.0.18/lib/brick-slider.browser.js"
  })
  await loadScript({
    id: SCRIPT_IDS.ACCESSIBILITY,
    src: "https://cdn.jsdelivr.net/npm/@sixsrc/brick-slider-accessibility@1.0.11/lib/brick-slider-accessibility.browser.js"
  })
  await loadScript({
    id: SCRIPT_IDS.STORIES,
    src: "https://cdn.jsdelivr.net/npm/@sixsrc/brick-slider-stories@1.0.14/lib/brick-slider-stories.browser.js"
  })
}

function createMarkup(id) {
  return `
    <div class="relative">
      <div
        id="${id}-slider"
        class="hidden pointer-events-none fixed inset-0 z-[10000] flex select-none items-center justify-center p-6 max-md:p-0"
      >
        <div
          class="bs-track group/stories pointer-events-auto relative z-[10001] aspect-[9/16] h-[min(86vh,760px)] w-[min(92vw,calc(86vh*9/16),430px)] max-w-[min(92vw,430px)] overflow-hidden max-md:fixed max-md:inset-0 max-md:h-[100dvh] max-md:min-h-[100dvh] max-md:w-[100dvw] max-md:min-w-[100dvw] max-md:max-w-[100dvw] max-md:aspect-auto"
        >
          <div class="bs-container h-full text-white">
            <div class="bs-slide h-full">
              <article
                class="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-violet-950 p-8 text-center md:justify-start md:pt-24"
              >
                <div class="relative text-xs font-semibold uppercase tracking-[0.18em] opacity-80 md:mt-4">
                  <span>Stories Plugin</span>
                </div>

                <div class="relative mt-4 max-w-[18rem] md:max-w-[14rem]">
                  <strong
                    class="block break-words text-[clamp(2.5rem,10vw,3.8rem)] font-bold leading-[0.96] md:text-[clamp(1.55rem,3vw,2rem)] md:leading-[1.08]"
                  >
                    <span class="block">Visual stories</span>
                    <span class="block">for sliders.</span>
                  </strong>
                </div>

                <span class="relative mt-5 text-sm opacity-70 md:mt-4 md:text-xs">Open from any trigger.</span>
              </article>
            </div>

            <div class="bs-slide h-full">
              <article
                class="relative flex h-full w-full flex-col items-center justify-start overflow-hidden bg-violet-950 p-8 pt-20 text-center"
              >
                <video
                  class="absolute inset-0 h-full w-full object-cover opacity-85"
                  src="https://github.com/sixsrc/brickslider/raw/refs/heads/main/website/public/video-storie-1.mp4"
                  playsinline
                  muted
                ></video>
                <div class="absolute inset-0 bg-gradient-to-t from-violet-950 via-violet-950/35 to-pink-500/20"></div>
                <div class="relative max-w-[16rem]">
                  <span class="mb-4 block text-sm uppercase tracking-[0.25em] opacity-80">
                    Video ready
                  </span>
                  <strong class="block break-words text-[clamp(1.5rem,5.5vw,2.35rem)] font-bold leading-[0.98]">
                    Rio de Janeiro
                  </strong>
                </div>
              </article>
            </div>

            <div class="bs-slide h-full">
              <article
                class="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-violet-950 p-8 text-center md:justify-start md:pt-24"
              >
                <span class="relative text-xs font-semibold uppercase tracking-[0.18em] opacity-70 md:mt-4">Separate package</span>
                <strong
                  class="relative mt-4 block max-w-[15rem] break-words text-[clamp(1.9rem,8vw,2.8rem)] font-bold leading-[1.02] md:max-w-[13rem] md:text-[clamp(1.45rem,3vw,1.85rem)] md:leading-[1.08]"
                >
                  <span class="block">Plugin-powered</span>
                  <span class="block">story experience.</span>
                </strong>
                <span class="relative mt-5 text-sm opacity-70 md:mt-4 md:text-xs">Runs on top of the core slider.</span>
              </article>
            </div>
          </div>

          <button
            class="bs-stories-mute pointer-events-auto absolute bottom-12 right-5 z-[10004] flex h-6 w-6 cursor-pointer items-center justify-center text-white/60 transition-colors transition-opacity hover:text-white/85 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-violet-950 md:pointer-events-none md:opacity-0 md:group-hover/stories:pointer-events-auto md:group-hover/stories:opacity-100"
            type="button"
            aria-label="Mute story sound"
          >
            <span class="bs-stories-mute-on">
              <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12zm-2.5-8.7v2.1A7.5 7.5 0 0 1 18.5 12a7.5 7.5 0 0 1-4.5 6.6v2.1A9.5 9.5 0 0 0 20.5 12 9.5 9.5 0 0 0 14 3.3z"></path>
              </svg>
            </span>
            <span class="bs-stories-mute-off hidden">
              <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 9v6h4l5 4V5L8 9H4zm10.59 3L12 9.41 13.41 8 16 10.59 18.59 8 20 9.41 17.41 12 20 14.59 18.59 16 16 13.41 13.41 16 12 14.59 14.59 12z"></path>
              </svg>
            </span>
          </button>

          <ul
            class="bs-stories-progress"
          >
            <li
              class="bs-stories-progress-item rounded-full bg-white/20 [&.bs-stories-progress-item--active]:bg-white/35 [&.bs-stories-progress-item--completed]:bg-white/45"
            >
              <span
                class="bs-stories-progress-bar rounded-full bg-white"
              ></span>
            </li>
          </ul>

          <button
            class="bs-stories-close pointer-events-auto fixed right-6 top-8 z-[10004] flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-violet-950 max-md:absolute max-md:right-4 max-md:top-24"
            type="button"
            aria-label="Close stories"
          >
            <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m6.4 5 12.6 12.6-1.4 1.4L5 6.4 6.4 5Zm12.6 1.4L6.4 19 5 17.6 17.6 5 19 6.4Z"></path>
            </svg>
          </button>

          <button
            class="bs-stories-pause-indicator pointer-events-none absolute z-[10004] hidden h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white opacity-0 transition-colors transition-opacity hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-white md:flex"
            type="button"
            aria-label="Toggle pause"
          >
            <span class="bs-stories-pause">
              <svg class="h-8 w-8 fill-current" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M8 6h3v12H8zM13 6h3v12h-3z"></path>
              </svg>
            </span>
            <span class="bs-stories-play hidden">
              <svg class="h-8 w-8 fill-current" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M8 5v14l11-7z"></path>
              </svg>
            </span>
          </button>
        </div>
      </div>

      <div class="bs-stories-layer hidden pointer-events-auto fixed inset-0 select-none">
        <div class="bs-stories-backdrop pointer-events-auto fixed inset-0 z-[9999] bg-violet-950/95"></div>
      </div>
    </div>
  `
}

function renderStoriesExample(host, index) {
  const id = `stories-inline-${index}`

  host.innerHTML = `
    <div class="stories-inline-host">
      <button
        id="${id}-open"
        class="cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-white rounded-full bg-violet-800 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        type="button"
      >
        Open Stories
      </button>
      ${createMarkup(id)}
    </div>
  `
}

function initStoriesExample(host, index) {
  const id = `stories-inline-${index}`

  const slider = new window.BrickSlider(`#${id}-slider`, {
    slidesPerView: 1,
    slidesPerPage: 1,
    useLoop: false
  })

  slider.use(
    new window.AccessibilityPlugin({
      useKeyboardNavigation: true
    })
  )

  slider.use(
    new window.BrickSliderStories({
      trigger: `#${id}-open`,
      duration: 5000,
      maxStories: 10,
      closeOnEnd: false,
      pauseOnHover: true,
      useMuted: true
    })
  )

  slider.init()
}

async function boot() {
  const hosts = Array.from(
    document.querySelectorAll("[data-inline-stories-example]")
  )
  hosts.forEach((host, index) => renderStoriesExample(host, index))

  ensureStyles()
  await ensureScripts()

  hosts.forEach((host, index) => initStoriesExample(host, index))
}

boot()
