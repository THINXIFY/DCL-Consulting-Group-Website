import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ServicesFinalCta } from './ServicesFinalCta';
import { servicesFinalCta } from '@/data/services-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('ServicesFinalCta', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, supporting copy, and the primary CTA', () => {
    mockMatchMedia(false);
    render(<ServicesFinalCta />);
    expect(screen.getByTestId('text-services-final-label')).toHaveTextContent(servicesFinalCta.label);
    expect(screen.getByTestId('text-services-final-title')).toHaveTextContent(servicesFinalCta.headlineLines[0]);
    expect(screen.getByTestId('text-services-final-title')).toHaveTextContent(servicesFinalCta.headlineLines[1]);
    expect(screen.getByTestId('text-services-final-supporting')).toHaveTextContent(servicesFinalCta.supporting);

    const primary = screen.getByTestId('link-services-final-primary');
    expect(primary).toHaveTextContent(servicesFinalCta.primaryCta.label);
    expect(primary).toHaveAttribute('href', servicesFinalCta.primaryCta.href);
    expect(primary.className).not.toMatch(/text-white/);
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<ServicesFinalCta />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<ServicesFinalCta />);
    const section = document.getElementById('services-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
