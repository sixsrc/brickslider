import { BaseSlider } from "./BaseSlider"
import type { BrickSlider } from "./BrickSlider"
import { INTERNAL_SELECTORS } from "./helpers"

export class Plugin extends BaseSlider {
  protected host: BrickSlider | null = null
  private readonly hasConfiguredRoot: boolean

  constructor($root?: string) {
    super($root ?? INTERNAL_SELECTORS.PLUGIN_ROOT_PLACEHOLDER)
    this.hasConfiguredRoot = !!$root
  }

  public init(): void {}

  public destroy(): void {}

  public setHost(host: BrickSlider): void {
    this.host = host
    if (!this.hasConfiguredRoot) this.syncRootContext(host.getRootKey())
  }

  public getPluginRoot(): string {
    return this.$root
  }

  public usesExplicitRoot(): boolean {
    return this.hasConfiguredRoot
  }
}
