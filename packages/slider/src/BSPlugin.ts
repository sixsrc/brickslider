import { BaseSlider } from "./BaseSlider"
import type { BrickSlider } from "./BrickSlider"

export class BSPlugin extends BaseSlider {
  protected host: BrickSlider | null = null

  constructor($root: string) {
    super($root)
  }

  public init(): void {}

  public destroy(): void {}

  public setHost(host: BrickSlider): void {
    this.host = host
  }

  public getPluginRoot(): string {
    return this.$root
  }
}
