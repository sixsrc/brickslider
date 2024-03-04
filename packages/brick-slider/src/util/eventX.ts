export const eventX = (event: MouseEvent | TouchEvent) =>
  event.type.includes("mouse") ? (event as MouseEvent) : (event as TouchEvent)
