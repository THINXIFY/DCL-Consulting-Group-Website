import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { teamDirectory } from '@/data/team-content';
import { TeamDirectory } from './TeamDirectory';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('TeamDirectory', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, intro, and all seven broader-team members with name and role', () => {
    mockMatchMedia(false);
    render(<TeamDirectory />);
    expect(screen.getByTestId('text-team-directory-eyebrow')).toHaveTextContent(teamDirectory.eyebrow);

    for (const member of teamDirectory.members) {
      const testId = `team-member-${member.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
      const el = screen.getByTestId(testId);
      expect(el).toHaveTextContent(member.name);
      expect(el).toHaveTextContent(member.role);
    }
  });

  it('renders the editorial micro-text lines', () => {
    mockMatchMedia(false);
    render(<TeamDirectory />);
    const section = document.getElementById('team-directory');
    for (const line of teamDirectory.microLines) {
      expect(section?.textContent).toContain(line);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<TeamDirectory />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<TeamDirectory />);
    const section = document.getElementById('team-directory');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
