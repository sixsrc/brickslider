const STYLE_IDS = {
  CORE: "stories-inline-core-style",
  SHARED: "stories-inline-shared-style",
  EMBED: "stories-inline-embed-style"
}

const SCRIPT_IDS = {
  CORE: "stories-inline-core-script",
  STORIES: "stories-inline-stories-script"
}

function ensureStyles() {
  const styles = [
    {
      id: STYLE_IDS.CORE,
      href: "https://cdn.jsdelivr.net/npm/@sixsrc/brick-slider@1.0.11/lib/brick-slider.css"
    },
    {
      id: STYLE_IDS.SHARED,
      href: "/examples/shared.css"
    },
    {
      id: STYLE_IDS.EMBED,
      href: "/examples/stories/embed.css?v=3"
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
    id: SCRIPT_IDS.CORE,
    src: "https://cdn.jsdelivr.net/npm/@sixsrc/brick-slider@1.0.11/lib/brick-slider.browser.js"
  })
  await loadScript({
    id: SCRIPT_IDS.STORIES,
    src: "https://cdn.jsdelivr.net/npm/@sixsrc/brick-slider-stories@1.0.8/lib/brick-slider-stories.browser.js"
  })
}

function createMarkup(id) {
  return `
    <div
      id="${id}-slider"
      class="stories-inline-root hidden"
    >
        <div
          class="bs-track stories-inline-track"
        >
          <div class="bs-container">
            <div class="bs-slide h-full">
              <article
                class="stories-inline-card stories-inline-card--top"
              >
                <div
                  class="stories-inline-badge"
                >
                  <span>Stories Plugin</span>
                </div>

                <div class="relative mt-4 max-w-[18rem] md:max-w-[14rem]">
                  <strong
                    class="stories-inline-title stories-inline-title--hero"
                  >
                    <span class="block">Visual stories</span>
                    <span class="block">for sliders.</span>
                  </strong>
                </div>

                <span
                  class="stories-inline-copy"
                >Open from any trigger.</span>
              </article>
            </div>

            <div class="bs-slide h-full">
              <article
                class="stories-inline-card stories-inline-card--top"
              >
                <video
                  class="stories-inline-video"
                  src="/video-storie-1.mp4"
                  playsinline
                  muted
                ></video>
                <div
                  class="stories-inline-video-overlay"
                ></div>
                <div class="relative max-w-[16rem]">
                  <span
                    class="mb-4 block text-sm uppercase tracking-[0.25em] text-white/80"
                  >
                    Video ready
                  </span>
                  <strong
                    class="block break-words text-[clamp(1.5rem,5.5vw,2.35rem)] font-bold leading-[0.98] text-white"
                  >
                    Rio de Janeiro
                  </strong>
                </div>
              </article>
            </div>

            <div class="bs-slide h-full">
              <article
                class="stories-inline-card stories-inline-card--top"
              >
                <span
                  class="stories-inline-badge"
                >Plugin API</span>
                <strong
                  class="stories-inline-title stories-inline-title--api"
                >
                  <span class="block">One trigger</span>
                  <span class="block">opens the flow.</span>
                </strong>
                <span
                  class="stories-inline-copy"
                >Text, image, or video.</span>
              </article>
            </div>
          </div>

            <ul class="bs-stories-progress stories-inline-progress">
              <li class="bs-stories-progress-item">
                <span class="bs-stories-progress-bar"></span>
              </li>
            </ul>

          <button
            class="bs-stories-mute stories-inline-mute"
            type="button"
            aria-label="Mute story sound"
          >
            <span class="bs-stories-mute-on">
              <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12zm-2.5-8.7v2.1A7.5 7.5 0 0 1 18.5 12a7.5 7.5 0 0 1-4.5 6.6v2.1A9.5 9.5 0 0 0 20.5 12 9.5 9.5 0 0 0 14 3.3z"></path>
              </svg>
            </span>
            <span class="bs-stories-mute-off hidden">
              <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4zm10.59 3L12 9.41 13.41 8 16 10.59 18.59 8 20 9.41 17.41 12 20 14.59 18.59 16 16 13.41 13.41 16 12 14.59 14.59 12z"></path>
              </svg>
            </span>
          </button>

          <button
            class="bs-stories-close stories-inline-close"
            type="button"
            aria-label="Close stories"
          >
            <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6.4 5 12.6 12.6-1.4 1.4L5 6.4 6.4 5Zm12.6 1.4L6.4 19 5 17.6 17.6 5 19 6.4Z"></path>
            </svg>
          </button>

          <button
            class="bs-stories-pause-indicator stories-inline-pause"
            type="button"
            aria-label="Toggle pause"
          >
            <span class="bs-stories-pause">
              <svg class="h-8 w-8 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 6h3v12H8zM13 6h3v12h-3z"></path>
              </svg>
            </span>
            <span class="bs-stories-play hidden">
              <svg class="h-8 w-8 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z"></path>
              </svg>
            </span>
          </button>
        </div>
      </div>

      <div class="bs-stories-layer stories-inline-layer hidden">
        <div
          class="bs-stories-backdrop stories-inline-backdrop"
        ></div>
      </div>
  `
}

function mountStoriesExample(host, index) {
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
    </div>
  `

  const existingRoot = document.getElementById(`${id}-slider`)
  if (existingRoot) existingRoot.remove()

  const existingLayer = document.querySelector(`[data-stories-layer-id="${id}"]`)
  if (existingLayer) existingLayer.remove()

  const wrapper = document.createElement("div")
  wrapper.innerHTML = createMarkup(id)

  const sliderRoot = wrapper.querySelector(`#${id}-slider`)
  const storiesLayer = wrapper.querySelector(".bs-stories-layer")

  if (!sliderRoot || !storiesLayer) return

  storiesLayer.setAttribute("data-stories-layer-id", id)

  document.body.appendChild(sliderRoot)
  document.body.appendChild(storiesLayer)

  const slider = new window.BrickSlider(`#${id}-slider`, {
    slidesPerView: 1,
    slidesPerPage: 1,
    useLoop: false
  })

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
  ensureStyles()
  await ensureScripts()

  const hosts = Array.from(document.querySelectorAll("[data-inline-stories-example]"))
  hosts.forEach((host, index) => mountStoriesExample(host, index))
}

boot()
