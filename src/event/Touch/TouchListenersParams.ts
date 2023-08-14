export interface TouchListenersParams {
  element: HTMLElement;
  index: number;
  touchStart: EventListener;
  touchEnd: EventListener;
  touchMove: EventListener;
}
