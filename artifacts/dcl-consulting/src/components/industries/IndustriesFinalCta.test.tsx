import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IndustriesFinalCta } from './IndustriesFinalCta';
import { industriesFinalCta } from '@/data/industries-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('IndustriesFinalCta', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, copy, and the Contact DCL button routing to /contact', () => {
    mockMatchMedia(false);
    render(<IndustriesFinalCta />);
    expect(screen.getByTestId('text-industries-final-eyebrow')).toHaveTextContent(industriesFinalCta.eyebrow);
    expect(screen.getByTestId('text-industries-final-title')).toHaveTextContent(industriesFinalCta.headlineLines[0]);
    expect(screen.getByTestId('text-industries-final-title')).toHaveTextContent(industriesFinalCta.headlineLines[1]);
    expect(screen.getByText(industriesFinalCta.copy)).toBeInTheDocument();

    const cta = screen.getByTestId('link-industries-final-cta');
    expect(cta).toHaveTextContent(industriesFinalCta.cta.label);
    expect(cta).toHaveAttribute('href', industriesFinalCta.cta.href);
    expect(cta.className).not.toMatch(/text-white/);
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<IndustriesFinalCta />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<IndustriesFinalCta />);
    const section = document.getElementById('industries-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
