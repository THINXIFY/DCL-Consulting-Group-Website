import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContactSupportCta } from './ContactSupportCta';
import { contactSupportCta } from '@/data/contact-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('ContactSupportCta', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, copy, CTA, and image', () => {
    mockMatchMedia(false);
    render(<ContactSupportCta />);
    expect(screen.getByText(contactSupportCta.label)).toBeInTheDocument();
    expect(screen.getByTestId('text-contact-support-title')).toHaveTextContent(contactSupportCta.headline);
    expect(screen.getByText(contactSupportCta.copy)).toBeInTheDocument();
    const cta = screen.getByTestId('link-contact-support-cta');
    expect(cta).toHaveTextContent(contactSupportCta.cta.label);
    expect(cta).toHaveAttribute('href', contactSupportCta.cta.href);
    expect(cta.className).not.toMatch(/text-white/);
    expect(screen.getByTestId('img-contact-support')).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<ContactSupportCta />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<ContactSupportCta />);
    const section = document.getElementById('contact-support-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
