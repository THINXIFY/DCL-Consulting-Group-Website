import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { teamHero } from '@/data/team-content';
import { TeamHero } from './TeamHero';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('TeamHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, eyebrow, headline, intro, and statement lines', () => {
    mockMatchMedia(false);
    render(<TeamHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
    expect(screen.getByTestId('text-team-hero-eyebrow')).toHaveTextContent(teamHero.eyebrow);
    expect(screen.getByTestId('text-team-hero-title')).toHaveTextContent(teamHero.headlineLines.join(''));
    expect(screen.getByTestId('text-team-hero-intro')).toHaveTextContent(teamHero.intro);
    const statement = screen.getByTestId('text-team-hero-statement');
    for (const line of teamHero.statementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<TeamHero />)).not.toThrow();
  });

  it('contains no em-dash characters', () => {
    mockMatchMedia(false);
    render(<TeamHero />);
    const section = document.getElementById('team-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
