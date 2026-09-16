import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RiskOpportunityAssessmentPage from './risk-opportunity-assessment';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('RiskOpportunityAssessmentPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all seven sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<RiskOpportunityAssessmentPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'risk-hero',
      'risk-our-perspective',
      'risk-key-areas',
      'risk-our-approach',
      'risk-areas-of-support',
      'risk-why-dcl',
      'risk-final-cta',
    ]);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
