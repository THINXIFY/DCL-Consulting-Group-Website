import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import IndustriesPage from './industries';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('IndustriesPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all seven Industries sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<IndustriesPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'industries-hero',
      'industries-intro',
      'industry-directory',
      'disciplined-approach',
      'cross-sector-perspective',
      'where-insight-matters',
      'industries-final-cta',
    ]);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
