import { $ } from "../../util";

export function getRootSelector(rootSelector: string): HTMLElement {
  return $(`${rootSelector}`);
}
