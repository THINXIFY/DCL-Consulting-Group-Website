import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ExpertisePage from './expertise';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('ExpertisePage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header and all five Expertise sections in order, and no footer', () => {
    mockDesktop(true);
    render(<ExpertisePage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'expertise-hero',
      'how-we-add-perspective',
      'core-expertise',
      'where-expertise-applies',
      'expertise-final-cta',
    ]);
    expect(document.querySelector('footer')).not.toBeInTheDocument();
  });
});
