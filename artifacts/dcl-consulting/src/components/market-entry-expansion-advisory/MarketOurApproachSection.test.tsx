import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MarketOurApproachSection } from './MarketOurApproachSection';
import { marketOurApproach } from '@/data/market-entry-expansion-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

describe('MarketOurApproachSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, CTA, image, and all four rows with no decorative numbering', () => {
    mockDesktop(true);
    render(<MarketOurApproachSection />);
    expect(screen.getByText(marketOurApproach.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('From opportunity');
    expect(screen.getByText(marketOurApproach.body)).toBeInTheDocument();
    expect(screen.getByTestId('img-market-our-approach')).toBeInTheDocument();
    const cta = screen.getByTestId('link-market-approach-cta');
    expect(cta).toHaveTextContent(marketOurApproach.cta.label);
    expect(cta).toHaveAttribute('href', marketOurApproach.cta.href);
    for (const row of marketOurApproach.rows) {
      const el = screen.getByTestId(`market-approach-row-${slug(row.name)}`);
      expect(el).toHaveTextContent(row.name);
      expect(el).toHaveTextContent(row.description);
    }
  });

  it('activates the first row by default on desktop, and previews a different one on hover', () => {
    mockDesktop(true);
    render(<MarketOurApproachSection />);
    const first = screen.getByTestId(`market-approach-row-${slug(marketOurApproach.rows[0]!.name)}`);
    const third = screen.getByTestId(`market-approach-row-${slug(marketOurApproach.rows[2]!.name)}`);
    expect(first).toHaveAttribute('data-active', 'true');
    expect(third).toHaveAttribute('data-active', 'false');

    fireEvent.mouseEnter(third);
    expect(third).toHaveAttribute('data-active', 'true');

    fireEvent.mouseLeave(third);
    expect(first).toHaveAttribute('data-active', 'true');
  });

  it('treats every row as visually active on mobile', () => {
    mockDesktop(false);
    render(<MarketOurApproachSection />);
    for (const row of marketOurApproach.rows) {
      expect(screen.getByTestId(`market-approach-row-${slug(row.name)}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<MarketOurApproachSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<MarketOurApproachSection />);
    const section = document.getElementById('market-our-approach');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
