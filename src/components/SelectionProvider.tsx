import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ObserveResult,
  SelectionContext,
  SelectionObserver,
  SelectionUtils,
} from './context';
import { Box, Position } from './typings';
import { Scrollable } from './useDragAutoScroll/typings';
import {
  calculateRenderRect,
  getMousePositionRelativeToElement,
} from './utils';

type Props<ScrollingElement, DT> = {
  scrollingElementRef: React.RefObject<ScrollingElement>;
  onSelectFinish?: (selectedItems: ObserveResult<DT>[]) => void;
  children?: React.ReactNode;
};

function SelectionProvider<ScrollingElement extends Scrollable, DT>({
  scrollingElementRef,
  onSelectFinish,
  children,
}: Props<ScrollingElement, DT>): React.ReactElement {
  const [observers] = useState(() => new Set<SelectionObserver<DT>>());
  const observersRef = useRef(observers);

  const observe = useCallback<SelectionUtils<DT>['observe']>((observer) => {
    observersRef.current.add(observer);
    return () => {
      observersRef.current.delete(observer);
    };
  }, []);

  const onSelectFinishRef = useRef(onSelectFinish);
  useEffect(() => {
    onSelectFinishRef.current = onSelectFinish;
  });

  useEffect(() => {
    let startAbsolutePosition = {
      left: 0,
      top: 0,
    };

    // 记住上一次鼠标移动的位置，在自动滚动时重新计算高度
    let lastMovePosition: Position = {
      left: 0,
      top: 0,
    };

    const scrollingElement = scrollingElementRef.current!;

    let selectedItems: ObserveResult<DT>[] = [];

    const renderSelection = (rect: Box) => {
      requestAnimationFrame(() => {
        if (rangeDomRef.current) {
          const renderRect = calculateRenderRect(rect, startAbsolutePosition, {
            ...scrollingElement.getBoundingClientRect(),
            height: scrollingElement.scrollHeight,
            width: scrollingElement.scrollWidth,
          });

          rangeDomRef.current.style.width = `${renderRect.width}px`;
          rangeDomRef.current.style.height = `${renderRect.height}px`;
          rangeDomRef.current.style.top = `${renderRect.top}px`;
          rangeDomRef.current.style.left = `${renderRect.left}px`;
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      rangeDomRef.current!.style.visibility = 'visible';
      const { left: mouseLeft, top: mouseTop } =
        getMousePositionRelativeToElement(scrollingElement, e);

      const selectionRect: Box = {
        width: Math.abs(mouseLeft - startAbsolutePosition.left),
        height: Math.abs(mouseTop - startAbsolutePosition.top),
        left: Math.min(mouseLeft, startAbsolutePosition.left),
        top: Math.min(mouseTop, startAbsolutePosition.top),
      };

      lastMovePosition = { left: e.clientX, top: e.clientY };

      renderSelection(selectionRect);

      selectedItems = [];

      observersRef.current.forEach((observer) => {
        selectedItems.push(observer(selectionRect, scrollingElement));
      });
    };

    const handleContainerScroll = () => {
      const selectionRect = {
        width: Math.abs(
          lastMovePosition.left +
            scrollingElement.scrollLeft -
            startAbsolutePosition.left
        ),
        height: Math.abs(
          lastMovePosition.top +
            scrollingElement.scrollTop -
            startAbsolutePosition.top
        ),
        left: Math.min(
          lastMovePosition.left + scrollingElement.scrollLeft,
          startAbsolutePosition.left
        ),
        top: Math.min(
          lastMovePosition.top + scrollingElement.scrollTop,
          startAbsolutePosition.top
        ),
      };

      // 刷新选择区域展示
      renderSelection(selectionRect);

      selectedItems = [];

      observersRef.current.forEach((observer) => {
        selectedItems.push(observer(selectionRect, scrollingElement));
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) {
        return;
      }

      startAbsolutePosition = getMousePositionRelativeToElement(
        scrollingElement,
        e
      );

      window.addEventListener('mousemove', handleMouseMove);
      scrollingElement.addEventListener('scroll', handleContainerScroll);
    };

    const handleMouseUp = (e: MouseEvent) => {
      renderSelection({ height: 0, left: 0, top: 0, width: 0 });
      rangeDomRef.current!.style.visibility = 'hidden';
      window.removeEventListener('mousemove', handleMouseMove);
      scrollingElement.removeEventListener('scroll', handleContainerScroll);
      onSelectFinishRef.current?.(selectedItems);
    };

    scrollingElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      scrollingElement.removeEventListener('mousedown', handleMouseDown);
      scrollingElement.removeEventListener('scroll', handleContainerScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const rangeDomRef = useRef<HTMLDivElement>(null);

  const contextValue = useMemo(() => ({ observe }), [observe]);

  return (
    <SelectionContext.Provider value={contextValue}>
      {children}
      <div
        ref={rangeDomRef}
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          border: '2px solid #1e7574',
          borderRadius: 2,
          backgroundColor: 'rgba(46, 140, 143, .2)',
          boxSizing: 'border-box',
          visibility: 'hidden',
        }}
      />
    </SelectionContext.Provider>
  );
}

export default SelectionProvider;
