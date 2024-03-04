export function waitFor(time: number, callback: () => void) {
  let start: number

  function wait(timestamp: number) {
    if (!start) start = timestamp
    if (timestamp - start < time) {
      requestAnimationFrame(wait)
    } else {
      callback()
    }
  }
  requestAnimationFrame(wait)
}
