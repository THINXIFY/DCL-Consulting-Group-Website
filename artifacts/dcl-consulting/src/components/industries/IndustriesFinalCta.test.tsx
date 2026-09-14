import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IndustriesFinalCta } from './IndustriesFinalCta';

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

  it('renders the small statement, headline, supporting copy, both CTAs, and the closing line', () => {
    mockMatchMedia(false);
    render(<IndustriesFinalCta />);
    expect(screen.getByTestId('text-industries-final-statement')).toHaveTextContent('Sector perspective.');
    expect(screen.getByTestId('text-industries-final-statement')).toHaveTextContent('Decision clarity.');
    expect(screen.getByTestId('text-industries-final-title')).toHaveTextContent('A clearer view');
    expect(screen.getByTestId('text-industries-final-title')).toHaveTextContent('of the opportunity.');
    expect(screen.getByTestId('text-industries-final-supporting')).toHaveTextContent(/independent analysis/i);

    const primary = screen.getByTestId('link-industries-final-primary');
    expect(primary).toHaveAttribute('href', '/#about');
    expect(primary).toHaveTextContent('Start a Conversation');

    const secondary = screen.getByTestId('link-industries-final-secondary');
    expect(secondary).toHaveAttribute('href', '/expertise');
    expect(secondary).toHaveTextContent('Explore Our Expertise');

    expect(screen.getByTestId('text-industries-final-closing')).toHaveTextContent('Clarity Before Capital.');
  });

  it('never turns the primary CTA text white', () => {
    mockMatchMedia(false);
    render(<IndustriesFinalCta />);
    const primary = screen.getByTestId('link-industries-final-primary');
    expect(primary.className).not.toMatch(/text-white/);
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
