/*export function getPositionX(event: any): any {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}*/

/*export function getPositionX(event: MouseEvent | TouchEvent): number {
  return event.type.includes("mouse")
    ? (event as MouseEvent).pageX
    : (event as TouchEvent).touches[0].clientX
}*/

export function getPositionX(event: MouseEvent | TouchEvent): number {
  if (event.type.includes("mouse")) {
    return (event as MouseEvent).pageX
  } else if (
    (event as TouchEvent).touches &&
    (event as TouchEvent).touches.length > 0
  ) {
    return (event as TouchEvent).touches[0].clientX
  } else {
    return NaN // Retorna NaN quando o tipo de evento não é reconhecido
  }
}
