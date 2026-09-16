import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach } from 'vitest';
import { gsap, ScrollTrigger } from '@/lib/gsap';

afterEach(() => {
  cleanup();
});

// GSAP's ScrollTrigger keeps a page-level heartbeat alive once any
// instance has ever been created, independent of individual components'
// own gsap.context().revert() cleanup. Under jsdom, a straggler tick can
// fire after a test file's environment has already torn down, throwing
// "requestAnimationFrame is not defined". Stopping the ticker and
// killing any remaining triggers before that teardown happens (rather
// than racing it) avoids that class of flake across every test file.
afterAll(() => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.ticker.sleep();
});

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof window.ResizeObserver === 'undefined') {
  window.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

// jsdom has no IntersectionObserver implementation. Components that use
// it (e.g. scrollspy-style table-of-contents highlighting) only need it
// to not throw in tests - the actual intersection behavior is exercised
// through real-browser QA, not unit tests.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

if (typeof window.IntersectionObserver === 'undefined') {
  window.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;
}

if (!('matchMedia' in window) || !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

if (typeof window.requestAnimationFrame === 'undefined') {
  window.requestAnimationFrame = (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 16) as unknown as number;
  window.cancelAnimationFrame = (handle: number) => clearTimeout(handle);
}

window.scrollTo = (() => {}) as unknown as typeof window.scrollTo;

if (typeof Element.prototype.scrollIntoView === 'undefined') {
  Element.prototype.scrollIntoView = () => {};
}
