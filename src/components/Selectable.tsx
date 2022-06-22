import React, { useEffect, useRef } from 'react';
import { Box } from './typings';
import { Scrollable } from './useDragAutoScroll/typings';
import useObserveSelection from './useObserveSelection';
import { boxIntersects, getElementPositionInContainer } from './utils';

type ChildProps = {
  intersecting: boolean;
};

interface Props<T extends Scrollable, DT> {
  children: (ref: React.Ref<T>, props: ChildProps) => React.ReactElement;
  getData: () => DT;
}

export type { Props as SelectableProps };

function Selectable<T extends Scrollable, DT>({
  children,
  getData,
}: Props<T, DT>): React.ReactElement {
  const domRef = useRef<T>(null);

  const getDataRef = useRef(getData);
  useEffect(() => {
    getDataRef.current = getData;
  });

  const [intersecting] = useObserveSelection<DT>(
    (selection, scrollingElement) => {
      const { left, top } = getElementPositionInContainer(
        domRef.current!,
        scrollingElement!
      );

      const domRect = domRef.current!.getBoundingClientRect();
      const box: Box = {
        top,
        left,
        height: domRect.height,
        width: domRect.width,
      };

      return {
        intersecting: boxIntersects(box, selection),
        data: getDataRef.current(),
      };
    }
  );

  return children(domRef, { intersecting });
}

export default Selectable;
