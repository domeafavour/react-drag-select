import React, { useRef } from 'react';
import DragSelect from './components/DragSelect';
import Selectable from './components/Selectable';
import { Scrollable } from './components/useDragAutoScroll/typings';

function App() {
  const scrollingElementRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollingElementRef}
      className="App"
      style={{
        position: 'relative',
        overflow: 'auto',
        width: 500,
        height: 500,
        border: '1px solid #f00',
      }}
    >
      <DragSelect<Scrollable, { index: number }>
        scrollingElementRef={scrollingElementRef}
        onSelectFinish={(selectedItems) => {
          console.log(
            selectedItems
              .filter((item) => item.intersecting)
              .map((item) => item.data)
          );
        }}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', width: 800 }}>
          {Array.from({ length: 50 }, (_, i) => (
            <Selectable getData={() => ({ index: i })}>
              {(ref, { intersecting }) => (
                <div
                  ref={ref as React.LegacyRef<HTMLDivElement>}
                  style={{
                    display: 'inline-block',
                    padding: 16,
                    border: '2px solid #f00',
                    background: intersecting
                      ? 'rgba(255, 0, 0, .2)'
                      : 'transparent',
                    borderRadius: 2,
                    userSelect: 'none',
                  }}
                >
                  {`SELECTABLE_${i + 1}`}
                </div>
              )}
            </Selectable>
          ))}
        </div>
      </DragSelect>
    </div>
  );
}

export default App;
