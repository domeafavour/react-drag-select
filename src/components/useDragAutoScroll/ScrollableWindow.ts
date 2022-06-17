import { Scrollable } from './typings';

const getWindowBoundingClientRect = (): DOMRect => {
  const windowRect: Omit<DOMRect, 'toJSON'> = {
    width: window.innerWidth,
    height: window.innerHeight,
    x: 0,
    y: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  return {
    ...windowRect,
    toJSON: () => windowRect,
  };
};

const ScrollableWindow: Scrollable = {
  addEventListener: function <K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ) {
    return window.addEventListener(type, listener, options);
  } as Scrollable['addEventListener'],
  removeEventListener: function <K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ) {
    return window.removeEventListener(type, listener, options);
  } as Scrollable['removeEventListener'],
  scrollHeight: 0,
  scrollWidth: 0,
  scrollLeft: window.scrollX,
  scrollTop: window.scrollY,
  scrollTo: ((options: ScrollToOptions) => {
    return window.scrollTo(options);
  }) as Scrollable['scrollTo'],
  getBoundingClientRect: getWindowBoundingClientRect,
};

export default Object.defineProperties<Scrollable>(ScrollableWindow, {
  scrollTop: {
    get: () => window.scrollY,
  },
  scrollLeft: {
    get: () => window.scrollX,
  },
  scrollWidth: {
    get: () => document.documentElement.scrollWidth,
  },
  scrollHeight: {
    get: () => document.documentElement.scrollHeight,
  },
  getBoundingClientRect: {
    get: () => getWindowBoundingClientRect,
  },
});
