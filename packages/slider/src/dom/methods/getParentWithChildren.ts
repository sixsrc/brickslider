function getParentWithChildren(div: HTMLElement): HTMLElement | null {
  const parentElement = div.parentNode as HTMLElement;
  if (parentElement.classList.contains("children")) {
    return parentElement;
  }
  return null;
}
