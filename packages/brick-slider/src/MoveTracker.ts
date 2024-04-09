export class MoveTracker {
  private startTime: number
  private startX: number
  private startY: number
  private currentX: number
  private currentY: number

  constructor() {
    this.startTime = 0
    this.startX = 0
    this.startY = 0
    this.currentX = 0
    this.currentY = 0
  }

  public startTracking(event: TouchEvent | MouseEvent) {
    this.startTime = Date.now()
    this.startX = this.getClientX(event)
    this.startY = this.getClientY(event)
    this.updateCurrentPosition(event)
  }

  public updateCurrentPosition(event: TouchEvent | MouseEvent) {
    this.currentX = this.getClientX(event)
    this.currentY = this.getClientY(event)
  }

  public stopTracking(): number {
    const endTime = Date.now()
    const endTimeElapsed = endTime - this.startTime
    return endTimeElapsed > 0 ? this.calculateSpeed(endTimeElapsed) : 0
  }

  private calculateSpeed(timeElapsed: number): number {
    const deltaX = this.currentX - this.startX
    const deltaY = this.currentY - this.startY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    return distance / timeElapsed
  }

  private getClientX(event: TouchEvent | MouseEvent): number {
    return "touches" in event ? event.touches[0].clientX : event.clientX
  }

  private getClientY(event: TouchEvent | MouseEvent): number {
    return "touches" in event ? event.touches[0].clientY : event.clientY
  }
}
