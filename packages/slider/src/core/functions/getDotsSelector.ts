import { $ } from "../../util";
import { dotsSelector } from "../../util/constants";

export function getDotsSelector(rootSelector: string): HTMLElement {
  return $(`${rootSelector} ${dotsSelector}`);
}
