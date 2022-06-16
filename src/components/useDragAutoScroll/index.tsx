import { useEffect, useState } from 'react';
import AutoScrollManager from './AutoScrollManager';
import { AutoScrollOptions } from './typings';
import { getMouseClientPositionOnContainer } from './utils';

function useDragAutoScroll<E extends HTMLElement>(
  containerRef: React.RefObject<E>,
  options?: AutoScrollOptions,
) {
  const [autoScrolling, setAutoScrolling] = useState(false);
  const { threshold = 24 } = options ?? {};

  useEffect(() => {
    const container = containerRef.current!;
    const autoScrollManager = new AutoScrollManager(container);

    autoScrollManager.listen((scrolling) => {
      setAutoScrolling(scrolling);
    });

    const handleMouseMove = (e: MouseEvent) => {
      const currentPosition = getMouseClientPositionOnContainer(e, container);

      const containerRect = container.getBoundingClientRect();

      //
      // +--------------------------------+
      // |   in threshold (auto scroll)   |
      // +--------------------------------+
      // | t |                        | t |
      // | h |                        | h |
      // | r |                        | r |
      // | e |                        | e |
      // | s |   STOP AUTO SCROLLING  | s |
      // | h |                        | h |
      // | o |                        | o |
      // | l |                        | l |
      // | d |                        | d |
      // +--------------------------------+
      // |   in threshold (auto scroll)   |
      // +--------------------------------+
      //
      const shouldStopAutoScrolling =
        currentPosition.x > threshold &&
        currentPosition.x <= containerRect.width - threshold &&
        currentPosition.y > threshold &&
        currentPosition.y <= containerRect.height - threshold;

      if (shouldStopAutoScrolling) {
        autoScrollManager.stop();
      } else if (currentPosition.y > containerRect.height - threshold) {
        if (!autoScrollManager.getScrolling() && e.movementY > 0) {
          autoScrollManager.scrollToBottom();
        }
      } else if (currentPosition.y <= threshold) {
        if (!autoScrollManager.getScrolling() && e.movementY < 0) {
          autoScrollManager.scrollToTop();
        }
      } else if (currentPosition.x > containerRect.width - threshold) {
        if (!autoScrollManager.getScrolling() && e.movementX > 0) {
          autoScrollManager.scrollToRight();
        }
      } else if (currentPosition.x <= threshold) {
        if (!autoScrollManager.getScrolling() && e.movementX < 0) {
          autoScrollManager.scrollToLeft();
        }
      }
    };

    const handelMouseDown = () => {
      window.addEventListener('mousemove', handleMouseMove);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      autoScrollManager.stop();
    };

    container.addEventListener('mousedown', handelMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handelMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [threshold]);

  return [autoScrolling] as [typeof autoScrolling];
}

export default useDragAutoScroll;
