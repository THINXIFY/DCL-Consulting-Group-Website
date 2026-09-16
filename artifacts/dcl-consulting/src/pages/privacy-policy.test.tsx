import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PrivacyPolicyPage from './privacy-policy';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('PrivacyPolicyPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all three Privacy sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<PrivacyPolicyPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual(['privacy-hero', 'privacy-content', 'privacy-support-cta']);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
