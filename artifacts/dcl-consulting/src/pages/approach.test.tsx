import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ApproachPage from './approach';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('ApproachPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all seven Approach sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<ApproachPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'approach-hero',
      'understanding-decision',
      'evaluation-process',
      'challenge-assumptions',
      'analysis-to-judgement',
      'working-with-dcl',
      'approach-final-cta',
    ]);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
