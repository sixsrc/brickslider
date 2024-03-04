export function getPositionX(event: MouseEvent | TouchEvent): number {
  if (event.type.includes("mouse")) {
    return (event as MouseEvent).pageX
  } else if (
    (event as TouchEvent).touches &&
    (event as TouchEvent).touches.length > 0
  ) {
    return (event as TouchEvent).touches[0].clientX
  } else {
    return NaN
  }
}
