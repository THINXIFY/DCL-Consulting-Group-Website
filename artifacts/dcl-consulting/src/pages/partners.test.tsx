import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PartnersPage from './partners';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('PartnersPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all seven Partners sections in order, and the global footer, with no Selected Relationships section', () => {
    mockDesktop(true);
    render(<PartnersPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'partners-hero',
      'why-partnerships-matter',
      'how-we-work-with-partners',
      'partnership-areas',
      'what-we-value',
      'international-perspective',
      'partners-final-cta',
    ]);
    expect(sectionIds).not.toContain('selected-relationships');
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
