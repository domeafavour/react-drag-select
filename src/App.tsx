import React, { useRef } from 'react';
import Selectable from './components/Selectable';
import SelectionProvider from './components/SelectionProvider';

function App() {
  const scrollingElementRef = useRef(document.documentElement);
  return (
    <div className="App">
      <SelectionProvider<HTMLElement, { index: number }>
        scrollingElementRef={scrollingElementRef}
        onSelectFinish={(selectedItems) => {
          console.log(
            selectedItems
              .filter((item) => item.intersecting)
              .map((item) => item.data)
          );
        }}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
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
      </SelectionProvider>
    </div>
  );
}

export default App;
