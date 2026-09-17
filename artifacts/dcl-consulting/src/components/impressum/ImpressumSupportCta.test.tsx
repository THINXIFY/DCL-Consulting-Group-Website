import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ImpressumSupportCta } from './ImpressumSupportCta';
import { impressumSupportCta } from '@/data/impressum-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('ImpressumSupportCta', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, copy, and CTA linking to the real /contact route', () => {
    mockMatchMedia(false);
    render(<ImpressumSupportCta />);
    expect(screen.getByText(impressumSupportCta.label)).toBeInTheDocument();
    expect(screen.getByTestId('text-impressum-support-title')).toHaveTextContent(impressumSupportCta.headline);
    expect(screen.getByText(impressumSupportCta.copy)).toBeInTheDocument();
    const cta = screen.getByTestId('link-impressum-support-cta');
    expect(cta).toHaveTextContent(impressumSupportCta.cta.label);
    expect(cta).toHaveAttribute('href', '/contact');
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<ImpressumSupportCta />)).not.toThrow();
  });

  it('contains no em-dash characters', () => {
    mockMatchMedia(false);
    render(<ImpressumSupportCta />);
    const section = document.getElementById('impressum-support-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
