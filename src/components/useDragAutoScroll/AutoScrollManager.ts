import { MaybeNull, Scrollable, ScrollCallback, ScrollingListener } from './typings';
import { isReachedBottom, isReachedLeft, isReachedRight, isReachedTop } from './utils';

class AutoScrollManager<E extends Scrollable> {
  private raf: number = -1;

  private scrollableElement: MaybeNull<E> = null;

  private scrollingListener: MaybeNull<ScrollingListener> = null;

  private scrolling: boolean = false;

  private offsetHorizontal: number = 6;

  private offsetVertical: number = 6;

  constructor(scrollableElement: E) {
    this.scrollableElement = scrollableElement;
  }

  public listen(listener: ScrollingListener) {
    this.scrollingListener = listener;
    return this;
  }

  public setOffsetHorizontal(offsetHorizontal: number) {
    this.offsetHorizontal = offsetHorizontal;
    return this;
  }

  public setOffsetVertical(offsetVertical: number) {
    this.offsetVertical = offsetVertical;
    return this;
  }

  public scroll(fn: ScrollCallback<E>) {
    const element = this.scrollableElement!;

    this.raf = window.requestAnimationFrame(() => {
      const { top, left, shouldStop } = fn(element);
      if (shouldStop) {
        this.stop();
      } else {
        if (!this.scrolling) {
          this.scrollingListener?.(true);
        }
        this.scrolling = true;
        element.scrollTo({ top, left });
        this.scroll(fn);
      }
    });
    return this;
  }

  public stop() {
    window.cancelAnimationFrame(this.raf);
    this.scrolling = false;
    this.scrollingListener?.(false);
    return this;
  }

  public getScrolling() {
    return this.scrolling;
  }

  public scrollToTop() {
    return this.scroll((scrollable) => ({
      top: scrollable.scrollTop - this.offsetVertical,
      shouldStop: isReachedTop(scrollable),
    }));
  }

  public scrollToRight() {
    return this.scroll((scrollable) => ({
      left: scrollable.scrollLeft + this.offsetHorizontal,
      shouldStop: isReachedRight(scrollable),
    }));
  }

  public scrollToBottom() {
    return this.scroll((scrollable) => ({
      top: scrollable.scrollTop + this.offsetVertical,
      shouldStop: isReachedBottom(scrollable),
    }));
  }

  public scrollToLeft() {
    return this.scroll((scrollable) => ({
      left: scrollable.scrollLeft - this.offsetHorizontal,
      shouldStop: isReachedLeft(scrollable),
    }));
  }
}

export default AutoScrollManager;
