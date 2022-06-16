export type AutoScrollOptions = {
  threshold?: number;
};

export type MousePosition = {
  x: number;
  y: number;
};

export type Scrollable = Pick<
  HTMLElement,
  | 'getBoundingClientRect'
  | 'scrollTo'
  | 'scrollLeft'
  | 'scrollTop'
  | 'scrollWidth'
  | 'scrollHeight'
  | 'addEventListener'
  | 'removeEventListener'
>;

export type ScrollingListener = (scrolling: boolean) => void;

export type ScrollCallback<E extends Scrollable> = (scrollable: E) => {
  top?: number;
  left?: number;
  shouldStop: boolean;
};

export type MaybeNull<T> = T | null;
