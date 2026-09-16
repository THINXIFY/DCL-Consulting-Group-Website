import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TermsPage from './terms';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('TermsPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all three Terms sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<TermsPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual(['terms-hero', 'terms-content', 'terms-support-cta']);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
