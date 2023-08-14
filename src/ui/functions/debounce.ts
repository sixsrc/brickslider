let timerId: number;

export function debounce(func: Function, delay: number): () => void {
  return function () {
    clearTimeout(timerId);
    timerId = setTimeout(func, delay);
  };
}
