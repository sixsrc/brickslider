/*export function getPositionX(event: any): any {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}*/

export function getPositionX(event: MouseEvent | TouchEvent): number {
  return event.type.includes("mouse")
    ? (event as MouseEvent).pageX
    : (event as TouchEvent).touches[0].clientX
}
