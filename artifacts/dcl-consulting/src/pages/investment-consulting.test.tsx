import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import InvestmentConsultingPage from './investment-consulting';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('InvestmentConsultingPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all seven sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<InvestmentConsultingPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'investment-consulting-hero',
      'our-approach',
      'what-we-evaluate',
      'investment-analysis',
      'areas-of-focus',
      'investment-why-dcl',
      'investment-final-cta',
    ]);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
