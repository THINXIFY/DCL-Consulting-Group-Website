import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import StrategicAdvisoryPage from './strategic-advisory';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('StrategicAdvisoryPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all seven sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<StrategicAdvisoryPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'strategic-hero',
      'strategic-our-perspective',
      'key-areas-of-strategic-advisory',
      'strategic-our-approach',
      'strategic-areas-of-focus',
      'strategic-why-dcl',
      'strategic-final-cta',
    ]);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
