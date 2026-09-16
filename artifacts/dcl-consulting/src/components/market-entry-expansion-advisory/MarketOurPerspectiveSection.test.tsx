import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MarketOurPerspectiveSection } from './MarketOurPerspectiveSection';
import { marketOurPerspective } from '@/data/market-entry-expansion-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('MarketOurPerspectiveSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, both body paragraphs, image, statement, and link', () => {
    mockDesktop(true);
    render(<MarketOurPerspectiveSection />);
    expect(screen.getByText(marketOurPerspective.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('New markets.');
    expect(screen.getByText(marketOurPerspective.body[0])).toBeInTheDocument();
    expect(screen.getByText(marketOurPerspective.body[1])).toBeInTheDocument();
    expect(screen.getByTestId('img-market-our-perspective')).toBeInTheDocument();
    const section = document.getElementById('market-our-perspective');
    for (const line of marketOurPerspective.statementLines) {
      expect(section?.textContent).toContain(line);
    }
    const link = screen.getByTestId('link-market-perspective-approach');
    expect(link).toHaveAttribute('href', marketOurPerspective.link.href);
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<MarketOurPerspectiveSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<MarketOurPerspectiveSection />);
    const section = document.getElementById('market-our-perspective');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
