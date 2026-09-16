import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MarketWhyDclSection } from './MarketWhyDclSection';
import { marketWhyDcl } from '@/data/market-entry-expansion-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('MarketWhyDclSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, image, and all four principles', () => {
    mockDesktop(true);
    render(<MarketWhyDclSection />);
    expect(screen.getByText(marketWhyDcl.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A strategic partner');
    expect(screen.getByText(marketWhyDcl.body)).toBeInTheDocument();
    expect(screen.getByTestId('img-market-why-dcl')).toBeInTheDocument();
    const section = document.getElementById('market-why-dcl');
    for (const principle of marketWhyDcl.principles) {
      expect(section?.textContent).toContain(principle);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<MarketWhyDclSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<MarketWhyDclSection />);
    const section = document.getElementById('market-why-dcl');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
