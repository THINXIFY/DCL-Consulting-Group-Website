import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { teamLeadership } from '@/data/team-content';
import { TeamLeadership } from './TeamLeadership';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('TeamLeadership', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, intro, and all four leaders with initials, name, role, and description', () => {
    mockMatchMedia(false);
    render(<TeamLeadership />);
    expect(screen.getByTestId('text-team-leadership-eyebrow')).toHaveTextContent(teamLeadership.eyebrow);
    const section = document.getElementById('team-leadership');
    expect(section?.textContent).toMatch(/experience that/i);

    for (const member of teamLeadership.members) {
      const testId = `team-leader-${member.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
      const el = screen.getByTestId(testId);
      expect(el).toHaveTextContent(member.initials);
      expect(el).toHaveTextContent(member.name);
      expect(el).toHaveTextContent(member.role);
      expect(el).toHaveTextContent(member.description);
    }
  });

  it('does not render any fabricated headshot images', () => {
    mockMatchMedia(false);
    render(<TeamLeadership />);
    expect(document.querySelectorAll('img')).toHaveLength(0);
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<TeamLeadership />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<TeamLeadership />);
    const section = document.getElementById('team-leadership');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
