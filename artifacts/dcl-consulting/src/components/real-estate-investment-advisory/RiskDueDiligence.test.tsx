import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RiskDueDiligence } from './RiskDueDiligence';
import { riskDueDiligence } from '@/data/real-estate-investment-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('RiskDueDiligence', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, image, and all six list items', () => {
    mockDesktop(true);
    render(<RiskDueDiligence />);
    expect(screen.getByText(riskDueDiligence.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A deeper look');
    expect(screen.getByText(riskDueDiligence.body)).toBeInTheDocument();
    expect(screen.getByTestId('img-risk-due-diligence')).toBeInTheDocument();
    for (const item of riskDueDiligence.list) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it('does not display a risk score, percentage, or chart', () => {
    mockDesktop(true);
    render(<RiskDueDiligence />);
    const section = document.getElementById('risk-due-diligence');
    expect(section?.textContent?.toLowerCase()).not.toMatch(/%|risk score/);
    expect(section?.querySelector('svg[role="img"], canvas')).not.toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<RiskDueDiligence />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<RiskDueDiligence />);
    const section = document.getElementById('risk-due-diligence');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
