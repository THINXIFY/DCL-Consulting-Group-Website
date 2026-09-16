import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MaAcquisitionAdvisoryPage from './ma-acquisition-advisory';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('MaAcquisitionAdvisoryPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all seven sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<MaAcquisitionAdvisoryPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'ma-hero',
      'ma-our-perspective',
      'ma-key-areas',
      'transaction-approach',
      'transaction-focus',
      'ma-why-dcl',
      'ma-final-cta',
    ]);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
