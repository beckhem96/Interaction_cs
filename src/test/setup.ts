import "@testing-library/jest-dom/vitest";

class TestResizeObserver implements ResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}

  observe(target: Element) {
    const isNode = target.classList.contains("react-flow__node");
    const width = isNode ? 88 : 800;
    const height = isNode ? 88 : 500;
    this.callback(
      [
        {
          target,
          contentRect: {
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            right: width,
            bottom: height,
            width,
            height,
            toJSON: () => ({})
          }
        } as ResizeObserverEntry
      ],
      this
    );
  }

  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = TestResizeObserver;

class TestDOMMatrixReadOnly {
  readonly a = 1;
  readonly b = 0;
  readonly c = 0;
  readonly d = 1;
  readonly e = 0;
  readonly f = 0;
  readonly m11 = 1;
  readonly m12 = 0;
  readonly m21 = 0;
  readonly m22 = 1;
  readonly m41 = 0;
  readonly m42 = 0;
}

Object.defineProperty(window, "DOMMatrixReadOnly", {
  configurable: true,
  value: TestDOMMatrixReadOnly
});

const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;

HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
  const rect = originalGetBoundingClientRect.call(this);
  if (rect.width > 0 && rect.height > 0) {
    return rect;
  }

  const isNode = this.classList.contains("react-flow__node");
  const width = isNode ? 88 : 800;
  const height = isNode ? 88 : 500;
  return {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height,
    toJSON: () => ({})
  };
};
