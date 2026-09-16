import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DueDiligenceSupportPage from './due-diligence-support';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('DueDiligenceSupportPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all seven sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<DueDiligenceSupportPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'due-diligence-hero',
      'dd-our-perspective',
      'dd-key-areas',
      'dd-process',
      'dd-areas-of-support',
      'dd-why-dcl',
      'dd-final-cta',
    ]);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
