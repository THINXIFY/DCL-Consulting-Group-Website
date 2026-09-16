import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RealEstateInvestmentAdvisoryPage from './real-estate-investment-advisory';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('RealEstateInvestmentAdvisoryPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all nine sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<RealEstateInvestmentAdvisoryPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'real-estate-hero',
      'our-perspective',
      'what-we-assess',
      'how-we-evaluate',
      'commercial-financial',
      'risk-due-diligence',
      'where-we-support',
      'why-dcl',
      'real-estate-final-cta',
    ]);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
