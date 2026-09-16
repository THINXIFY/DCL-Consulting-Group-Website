import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PrivacyHero } from './PrivacyHero';
import { privacyHero } from '@/data/privacy-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('PrivacyHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, intro, image, and statement', () => {
    mockMatchMedia(false);
    render(<PrivacyHero />);
    expect(screen.getByTestId('text-privacy-hero-label')).toHaveTextContent(privacyHero.label);
    expect(screen.getByTestId('text-privacy-hero-title')).toHaveTextContent(privacyHero.headline);
    expect(screen.getByTestId('text-privacy-hero-intro')).toHaveTextContent(privacyHero.intro);
    expect(screen.getByTestId('img-privacy-hero')).toBeInTheDocument();
    const statement = screen.getByTestId('text-privacy-hero-statement');
    for (const line of privacyHero.statementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('renders the header inside the hero', () => {
    mockMatchMedia(false);
    render(<PrivacyHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<PrivacyHero />)).not.toThrow();
  });

  it('contains no em-dash characters', () => {
    mockMatchMedia(false);
    render(<PrivacyHero />);
    const section = document.getElementById('privacy-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
