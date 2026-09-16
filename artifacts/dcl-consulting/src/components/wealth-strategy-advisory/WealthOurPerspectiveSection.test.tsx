import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WealthOurPerspectiveSection } from './WealthOurPerspectiveSection';
import { wealthOurPerspective } from '@/data/wealth-strategy-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('WealthOurPerspectiveSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, both body paragraphs, image, statement, and link', () => {
    mockDesktop(true);
    render(<WealthOurPerspectiveSection />);
    expect(screen.getAllByText(wealthOurPerspective.label).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Wealth is broader');
    expect(screen.getByText(wealthOurPerspective.body[0])).toBeInTheDocument();
    expect(screen.getByText(wealthOurPerspective.body[1])).toBeInTheDocument();
    expect(screen.getByTestId('img-wealth-our-perspective')).toBeInTheDocument();
    const section = document.getElementById('wealth-our-perspective');
    for (const line of wealthOurPerspective.statementLines) {
      expect(section?.textContent).toContain(line);
    }
    const link = screen.getByTestId('link-wealth-our-perspective');
    expect(link).toHaveAttribute('href', wealthOurPerspective.link.href);
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<WealthOurPerspectiveSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WealthOurPerspectiveSection />);
    const section = document.getElementById('wealth-our-perspective');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
