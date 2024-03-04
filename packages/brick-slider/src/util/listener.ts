export function listener(
  events: string | string[],
  target: EventTarget,
  callback: EventListenerOrEventListenerObject
): void {
  if (typeof events === "string") {
    target.addEventListener(events, callback)
  } else if (Array.isArray(events)) {
    events.forEach(event => {
      target.addEventListener(event, callback)
    })
  } else {
    throw new Error(
      "The 'events' parameter must be a string or an array of strings"
    )
  }
}
