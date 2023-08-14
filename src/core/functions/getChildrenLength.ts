import { getChildren } from "./getChildren";

export function getChildrenLength(rootSelector: string): number {
  const children = Array.from(getChildren(rootSelector).children);
  return children.length;
}
