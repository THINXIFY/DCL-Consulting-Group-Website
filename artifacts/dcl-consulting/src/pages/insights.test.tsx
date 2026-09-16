import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import InsightsPage from './insights';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('InsightsPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all seven Insights sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<InsightsPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'insights-hero',
      'featured-insight',
      'latest-perspectives',
      'insight-themes',
      'dcl-viewpoint',
      'insights-archive',
      'insights-final-cta',
    ]);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
