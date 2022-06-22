import React from 'react';
import SelectionProvider, { SelectionProviderProps } from './SelectionProvider';
import useDragAutoScroll from './useDragAutoScroll';
import { Scrollable } from './useDragAutoScroll/typings';

interface Props<ScrollingElement extends Scrollable, DT>
  extends SelectionProviderProps<ScrollingElement, DT> {}

export type { Props as DragSelectProps };

function DragSelect<SE extends Scrollable, DT>({
  scrollingElementRef,
  children,
  onSelectFinish,
}: Props<SE, DT>): React.ReactElement {
  useDragAutoScroll(scrollingElementRef);
  return (
    <SelectionProvider
      scrollingElementRef={scrollingElementRef}
      onSelectFinish={onSelectFinish}
    >
      {children}
    </SelectionProvider>
  );
}

export default DragSelect;
