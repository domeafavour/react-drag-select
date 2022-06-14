import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  ObserveResult,
  SelectionContext,
  SelectionObserver,
  SelectionUtils,
} from './context';
import { Box } from './typings';
import {
  calculateRenderRect,
  getMousePosition,
  getMousePositionRelativeToElement,
} from './utils';

type Props<ScrollingElement, DT> = {
  scrollingElementRef: React.RefObject<ScrollingElement>;
  onSelectFinish?: (selectedItems: ObserveResult<DT>[]) => void;
  children?: React.ReactNode;
};

function SelectionProvider<ScrollingElement extends HTMLElement, DT>({
  scrollingElementRef: scrollingElement,
  onSelectFinish,
  children,
}: Props<ScrollingElement, DT>): React.ReactElement {
  const rangeContainer = document.body;
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
    const startClientPosition = {
      left: 0,
      top: 0,
    };

    const startAbsolutePosition = {
      left: 0,
      top: 0,
    };

    let selectedItems: ObserveResult<DT>[] = [];

    const renderSelection = (rect: Box) => {
      requestAnimationFrame(() => {
        if (rangeDomRef.current) {
          const renderRect = calculateRenderRect(
            rect,
            startClientPosition,
            scrollingElement.current!.getBoundingClientRect()
          );

          rangeDomRef.current.style.width = `${renderRect.width}px`;
          rangeDomRef.current.style.height = `${renderRect.height}px`;
          rangeDomRef.current.style.top = `${renderRect.top}px`;
          rangeDomRef.current.style.left = `${renderRect.left}px`;
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      rangeDomRef.current!.style.visibility = 'visible';

      const selectionRect: Box = {
        width: Math.abs(e.clientX - startClientPosition.left),
        height: Math.abs(e.clientY - startClientPosition.top),
        left: Math.min(e.clientX, startClientPosition.left),
        top: Math.min(e.clientY, startClientPosition.top),
      };

      const { left: mouseLeft, top: mouseTop } =
        getMousePositionRelativeToElement(scrollingElement.current!, e);

      renderSelection({
        width: Math.abs(mouseLeft - startAbsolutePosition.left),
        height: Math.abs(mouseTop - startAbsolutePosition.top),
        left: Math.min(mouseLeft, startAbsolutePosition.left),
        top: Math.min(mouseTop, startAbsolutePosition.top),
      });

      selectedItems = [];

      observersRef.current.forEach((observer) => {
        selectedItems.push(observer(selectionRect));
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      startClientPosition.left = e.clientX;
      startClientPosition.top = e.clientY;

      const { left: mouseLeft, top: mouseTop } = getMousePosition(e);
      startAbsolutePosition.left = mouseLeft;
      startAbsolutePosition.top = mouseTop;

      window.addEventListener('mousemove', handleMouseMove);
    };

    const handleMouseUp = (e: MouseEvent) => {
      renderSelection({ height: 0, left: 0, top: 0, width: 0 });
      rangeDomRef.current!.style.visibility = 'hidden';
      window.removeEventListener('mousemove', handleMouseMove);
      onSelectFinishRef.current?.(selectedItems);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const rangeDomRef = useRef<HTMLDivElement>(null);

  const rangeElement = (
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
  );

  const contextValue = useMemo(() => ({ observe }), [observe]);

  return (
    <SelectionContext.Provider value={contextValue}>
      {children}
      {ReactDOM.createPortal(rangeElement, rangeContainer)}
    </SelectionContext.Provider>
  );
}

export default SelectionProvider;
