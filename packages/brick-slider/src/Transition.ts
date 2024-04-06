class Transition {
  private readonly NEWTON_ITERATIONS = 4
  private readonly NEWTON_MIN_SLOPE = 0.001
  private readonly SUBDIVISION_PRECISION = 0.0000001
  private readonly SUBDIVISION_MAX_ITERATIONS = 10
  private readonly kSplineTableSize = 11
  private readonly kSampleStepSize = 1.0 / (this.kSplineTableSize - 1.0)

  private readonly mX1: number
  private readonly mY1: number
  private readonly mX2: number
  private readonly mY2: number
  private sampleValues: any

  constructor(mX1: number, mY1: number, mX2: number, mY2: number) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      throw new Error("bezier x values must be in [0, 1] range")
    }

    this.mX1 = mX1
    this.mY1 = mY1
    this.mX2 = mX2
    this.mY2 = mY2
  }

  private A(aA1: number, aA2: number): number {
    return 1.0 - 3.0 * aA2 + 3.0 * aA1
  }
  private B(aA1: number, aA2: number): number {
    return 3.0 * aA2 - 6.0 * aA1
  }
  private C(aA1: number): number {
    return 3.0 * aA1
  }

  private calcBezier(aT: number): number {
    return (
      ((this.A(this.mX1, this.mX2) * aT + this.B(this.mX1, this.mX2)) * aT +
        this.C(this.mX1)) *
      aT
    )
  }

  private getSlope(aT: number): number {
    return (
      3.0 * this.A(this.mX1, this.mX2) * aT * aT +
      2.0 * this.B(this.mX1, this.mX2) * aT +
      this.C(this.mX1)
    )
  }

  private binarySubdivide(
    aX: number,
    aA: number,
    aB: number,
    mX1: number,
    mX2: number
  ): number {
    let currentX,
      currentT,
      i = 0
    do {
      currentT = aA + (aB - aA) / 2.0
      currentX = this.calcBezier(currentT) - aX
      if (currentX > 0.0) {
        aB = currentT
      } else {
        aA = currentT
      }
    } while (
      Math.abs(currentX) > this.SUBDIVISION_PRECISION &&
      ++i < this.SUBDIVISION_MAX_ITERATIONS
    )
    return currentT
  }

  private newtonRaphsonIterate(aX: number, aGuessT: number): number {
    for (let i = 0; i < this.NEWTON_ITERATIONS; ++i) {
      const currentSlope = this.getSlope(aGuessT)
      if (currentSlope === 0.0) {
        return aGuessT
      }
      const currentX = this.calcBezier(aGuessT) - aX
      aGuessT -= currentX / currentSlope
    }
    return aGuessT
  }

  private getTForX(aX: number): number {
    let intervalStart = 0.0
    let currentSample = 1
    const lastSample = this.kSplineTableSize - 1

    for (
      ;
      currentSample !== lastSample && this.sampleValues[currentSample] <= aX;
      ++currentSample
    ) {
      intervalStart += this.kSampleStepSize
    }
    --currentSample

    // Interpolate to provide an initial guess for t
    const dist =
      (aX - this.sampleValues[currentSample]) /
      (this.sampleValues[currentSample + 1] - this.sampleValues[currentSample])
    let guessForT = intervalStart + dist * this.kSampleStepSize

    const initialSlope = this.getSlope(guessForT)
    if (initialSlope >= this.NEWTON_MIN_SLOPE) {
      return this.newtonRaphsonIterate(aX, guessForT)
    } else if (initialSlope === 0.0) {
      return guessForT
    } else {
      return this.binarySubdivide(
        aX,
        intervalStart,
        intervalStart + this.kSampleStepSize,
        this.mX1,
        this.mX2
      )
    }
  }

  public getEasingFunction(): (x: number) => number {
    if (this.mX1 === this.mY1 && this.mX2 === this.mY2) {
      return x => x // Linear easing
    }

    const sampleValues = new Array<number>(this.kSplineTableSize)
    for (let i = 0; i < this.kSplineTableSize; ++i) {
      sampleValues[i] = this.calcBezier(i * this.kSampleStepSize)
    }

    return (x: number) => {
      if (x === 0 || x === 1) {
        return x
      }
      return this.calcBezier(this.getTForX(x))
    }
  }
}
