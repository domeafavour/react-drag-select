import { MousePosition, Scrollable } from './typings';

export function isReachedTop<E extends Scrollable>(container: E): boolean {
  return container.scrollTop <= 0;
}

export function isReachedLeft<E extends Scrollable>(container: E): boolean {
  return container.scrollLeft <= 0;
}

export function isReachedRight<E extends Scrollable>(container: E): boolean {
  return container.scrollLeft + container.getBoundingClientRect().width >= container.scrollWidth;
}

export function isReachedBottom<E extends Scrollable>(container: E): boolean {
  return container.scrollTop + container.getBoundingClientRect().height >= container.scrollHeight;
}

export function getMouseClientPositionOnContainer<E extends Scrollable>(
  e: MouseEvent,
  container: E,
): MousePosition {
  const containerRect = container.getBoundingClientRect();
  const clientX = e.clientX - containerRect.left;
  const clientY = e.clientY - containerRect.top;
  return { x: clientX, y: clientY };
}
