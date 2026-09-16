import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PrivateCapitalAdvisoryPage from './private-capital-advisory';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('PrivateCapitalAdvisoryPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all seven sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<PrivateCapitalAdvisoryPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'private-capital-hero',
      'pc-our-perspective',
      'pc-key-areas',
      'investment-approach',
      'investment-focus',
      'pc-why-dcl',
      'pc-final-cta',
    ]);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
