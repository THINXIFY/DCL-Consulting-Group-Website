import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ServicesPage from './services';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('ServicesPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all seven Services sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<ServicesPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'services-hero',
      'service-directory',
      'how-we-work',
      'why-choose-dcl',
      'selected-services',
      'services-faq',
      'services-final-cta',
    ]);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
