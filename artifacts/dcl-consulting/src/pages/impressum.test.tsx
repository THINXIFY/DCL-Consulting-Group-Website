import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ImpressumPage from './impressum';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('ImpressumPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all three Impressum sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<ImpressumPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual(['impressum-hero', 'impressum-content', 'impressum-support-cta']);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
