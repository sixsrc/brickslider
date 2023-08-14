export function getPositionX(event: any): any {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}
