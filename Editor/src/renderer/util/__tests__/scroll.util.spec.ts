import scrollParentToChild from '../scroll.util';

function createElement(rect: Partial<DOMRect>, clientHeight: number, clientWidth: number): HTMLElement {
  const el = document.createElement('div');
  jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...rect
  });
  Object.defineProperty(el, 'clientHeight', { value: clientHeight });
  Object.defineProperty(el, 'clientWidth', { value: clientWidth });
  return el;
}

describe('scrollParentToChild', () => {
  it('does nothing when parent is null', () => {
    const child = document.createElement('div');
    expect(() => scrollParentToChild(null, child)).not.toThrow();
  });

  it('does nothing when child is null', () => {
    const parent = document.createElement('div');
    expect(() => scrollParentToChild(parent, null)).not.toThrow();
  });

  it('does nothing when both are null', () => {
    expect(() => scrollParentToChild(null, null)).not.toThrow();
  });

  it('does not scroll when child is already viewable', () => {
    const parent = createElement({ top: 0, bottom: 200 }, 200, 100);
    const child = createElement({ top: 50, bottom: 80 }, 30, 100);
    parent.scrollTop = 0;
    scrollParentToChild(parent, child);
    expect(parent.scrollTop).toBe(0);
  });

  it('scrolls down when child is below the viewable area', () => {
    const parent = createElement({ top: 0, bottom: 200 }, 200, 100);
    const child = createElement({ top: 250, bottom: 280 }, 30, 100);
    parent.scrollTop = 0;
    scrollParentToChild(parent, child);
    // scrollBot = 280 - 200 = 80, scrollTop = 250 - 0 = 250
    // abs(80) < abs(250) → uses scrollBot
    expect(parent.scrollTop).toBe(80);
  });

  it('scrolls up when child is above the viewable area', () => {
    const parent = createElement({ top: 100, bottom: 300 }, 200, 100);
    const child = createElement({ top: 50, bottom: 80 }, 30, 100);
    parent.scrollTop = 100;
    scrollParentToChild(parent, child);
    // scrollTop = 50 - 100 = -50, scrollBot = 80 - 300 = -220
    // abs(-50) < abs(-220) → uses scrollTop
    expect(parent.scrollTop).toBe(50);
  });
});
