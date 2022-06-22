import { Box, Position } from './typings';
import { Scrollable } from './useDragAutoScroll/typings';

export function getMousePosition(e: MouseEvent): Position {
  const scrollX =
    document.documentElement.scrollLeft || document.body.scrollLeft;
  const scrollY = document.documentElement.scrollTop || document.body.scrollTop;
  const left = e.pageX || e.clientX + scrollX;
  const top = e.pageY || e.clientY + scrollY;
  return { left, top };
}

export function getElementPositionInContainer<E extends Scrollable>(
  el: E,
  container: E
): Position {
  const elementRect = el.getBoundingClientRect();
  return {
    left: elementRect.left + container.scrollLeft,
    top: elementRect.top + container.scrollTop,
  };
}

export function getMousePositionRelativeToElement<E extends Scrollable>(
  el: E,
  e: MouseEvent
): Position {
  const boundingClientRect = el.getBoundingClientRect();
  return {
    left: e.clientX - boundingClientRect.left + el.scrollLeft,
    top: e.clientY - boundingClientRect.top + el.scrollTop,
  };
}

export function boxIntersects(boxA: Box, boxB: Box): boolean {
  return (
    boxA.left <= boxB.left + boxB.width &&
    boxA.left + boxA.width >= boxB.left &&
    boxA.top <= boxB.top + boxB.height &&
    boxA.top + boxA.height >= boxB.top
  );
}

export function calculateRenderRect(
  rect: Box,
  start: Position,
  container: Box
): Box {
  const width =
    rect.left < 0
      ? start.left
      : rect.left + rect.width >= container.width
      ? container.width - rect.left
      : rect.width;
  const left = rect.left < 0 ? 0 : rect.left;
  const top = rect.top < 0 ? 0 : rect.top;
  const height =
    rect.top + rect.height >= container.height
      ? container.height - rect.top
      : rect.height;

  return {
    width,
    height: rect.top < 0 ? start.top : height,
    top,
    left,
  };
}
