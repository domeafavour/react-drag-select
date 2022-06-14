import React, { useEffect, useRef } from 'react';
import useObserveSelection from './useObserveSelection';
import { boxIntersects } from './utils';

type ChildProps = {
  intersecting: boolean;
};

interface Props<T extends HTMLElement, DT> {
  children: (ref: React.Ref<T>, props: ChildProps) => React.ReactElement;
  getData: () => DT;
}

export type { Props as SelectableProps };

function Selectable<T extends HTMLElement, DT>({
  children,
  getData,
}: Props<T, DT>): React.ReactElement {
  const domRef = useRef<T>(null);

  const getDataRef = useRef(getData);
  useEffect(() => {
    getDataRef.current = getData;
  });

  const [intersecting] = useObserveSelection<DT>((selection) => {
    return {
      intersecting: boxIntersects(
        domRef.current!.getBoundingClientRect(),
        selection
      ),
      data: getDataRef.current(),
    };
  });

  return children(domRef, { intersecting });
}

export default Selectable;
