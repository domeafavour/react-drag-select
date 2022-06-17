import { useEffect, useRef, useState } from 'react';
import { SelectionObserver, useSelectionContext } from './context';

function useObserveSelection<T>(observer: SelectionObserver<T>) {
  const { observe } = useSelectionContext();
  const [intersecting, setIntersecting] = useState(false);
  const observerRef = useRef(observer);
  useEffect(() => {
    observerRef.current = observer;
  });

  useEffect(() => {
    const unobserve = observe((selection, scrollingElement) => {
      const observeResult = observerRef.current(selection, scrollingElement);
      setIntersecting(observeResult.intersecting);
      return observeResult;
    });

    return () => {
      unobserve();
    };
  }, []);

  return [intersecting] as [typeof intersecting];
}

export default useObserveSelection;
