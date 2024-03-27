export default class MouseSpeed {
  private cb: () => void
  public speedX: number
  public speedY: number
  private oldX: number
  private oldY: number
  private firstCalc: boolean
  private timerId: NodeJS.Timeout | null

  constructor() {
    this.cb = () => {}
    this.speedX = 0
    this.speedY = 0
    this.oldX = 0
    this.oldY = 0
    this.firstCalc = true
    this.timerId = null
    this.calcSpeed = this.calcSpeed.bind(this)
  }

  private calcSpeed(e: MouseEvent): void {
    if (!this.firstCalc) {
      this.speedX = e.clientX - this.oldX
      this.speedY = e.clientY - this.oldY
      this.oldX = e.clientX
      this.oldY = e.clientY
      this.cb()
      this.setToZero()
    } else {
      this.oldX = e.clientX
      this.oldY = e.clientY
      this.firstCalc = false
    }
  }

  private setToZero(): void {
    if (this.timerId) clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      this.speedX = 0
      this.speedY = 0
      this.cb()
    }, 50)
  }

  public init(
    cb: () => void = () => {
      console.log(
        `Pass a callback function on init to access speedX and speedY.`
      )
    }
  ): void {
    this.cb = cb
    window.addEventListener("mousemove", this.calcSpeed)
  }

  public destroy(cb: () => void): void {
    window.removeEventListener("mousemove", this.calcSpeed)
    cb()
  }
}
