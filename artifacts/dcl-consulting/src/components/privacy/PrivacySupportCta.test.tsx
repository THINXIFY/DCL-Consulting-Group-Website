import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PrivacySupportCta } from './PrivacySupportCta';
import { privacySupportCta } from '@/data/privacy-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('PrivacySupportCta', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, copy, and CTA linking to the real /contact route', () => {
    mockMatchMedia(false);
    render(<PrivacySupportCta />);
    expect(screen.getByText(privacySupportCta.label)).toBeInTheDocument();
    expect(screen.getByTestId('text-privacy-support-title')).toHaveTextContent(privacySupportCta.headline);
    expect(screen.getByText(privacySupportCta.copy)).toBeInTheDocument();
    const cta = screen.getByTestId('link-privacy-support-cta');
    expect(cta).toHaveTextContent(privacySupportCta.cta.label);
    expect(cta).toHaveAttribute('href', '/contact');
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<PrivacySupportCta />)).not.toThrow();
  });

  it('contains no em-dash characters', () => {
    mockMatchMedia(false);
    render(<PrivacySupportCta />);
    const section = document.getElementById('privacy-support-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
