// packages/slider/src/index.ts
// Library entry — re-export only the class and avoid running demo code on import.
// In development, dynamically load the dev-demo module so HMR works, but DCE removes it in production.
/*
 * Contributors
 * ------------
 * This project maintains a `CONTRIBUTORS.md` file at the repository root.
 * When the library build is ready, maintainers can populate `CONTRIBUTORS.md`
 * or use the `all-contributors` CLI to add contributors automatically.
 *
 * Example (to be added after release):
 * - Marcus Torres — maintainer — https://github.com/marcustorres
 */

export { BrickSlider } from "./BrickSlider"
export { BSPlugin } from "./BSPlugin"

if (import.meta.env.DEV) {
  import("../development/dev-demo")
    .then(m => {
      m.startDemo?.()
    })
    .catch(e => {
      console.warn("Failed to load dev-demo (dev only):", e)
    })
}
