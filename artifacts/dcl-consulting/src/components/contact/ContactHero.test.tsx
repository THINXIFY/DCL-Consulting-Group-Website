import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContactHero } from './ContactHero';
import { contactHero } from '@/data/contact-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('ContactHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, lead, both CTAs, image, and statement', () => {
    mockDesktop(true);
    render(<ContactHero />);
    expect(screen.getByTestId('text-contact-hero-label')).toHaveTextContent(contactHero.label);
    expect(screen.getByTestId('text-contact-hero-title')).toHaveTextContent(contactHero.headlineLines[0]);
    expect(screen.getByTestId('text-contact-hero-title')).toHaveTextContent(contactHero.headlineLines[1]);
    expect(screen.getByTestId('text-contact-hero-lead')).toHaveTextContent(contactHero.lead);

    const primary = screen.getByTestId('link-contact-hero-primary');
    expect(primary).toHaveTextContent(contactHero.primaryCta.label);
    expect(primary).toHaveAttribute('href', contactHero.primaryCta.href);
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-contact-hero-secondary');
    expect(secondary).toHaveTextContent(contactHero.secondaryCta.label);
    expect(secondary).toHaveAttribute('href', contactHero.secondaryCta.href);

    expect(screen.getByTestId('img-contact-hero')).toBeInTheDocument();
    const statement = screen.getByTestId('text-contact-hero-statement');
    for (const line of contactHero.imageStatementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('renders the header inside the hero', () => {
    mockDesktop(true);
    render(<ContactHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<ContactHero />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<ContactHero />);
    const section = document.getElementById('contact-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
