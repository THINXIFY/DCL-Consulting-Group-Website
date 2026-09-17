import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TeamPage from './team';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('TeamPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all four Team sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<TeamPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual(['team-hero', 'team-leadership', 'team-directory', 'team-final-cta']);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
