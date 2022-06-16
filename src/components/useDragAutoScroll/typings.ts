export type AutoScrollOptions = {
  threshold?: number;
};

export type MousePosition = {
  x: number;
  y: number;
};

export type ScrollingListener = (scrolling: boolean) => void;

export type ScrollCallback<E extends HTMLElement> = (
  scrollable: E,
) => { top?: number; left?: number; shouldStop: boolean };

export type MaybeNull<T> = T | null;
