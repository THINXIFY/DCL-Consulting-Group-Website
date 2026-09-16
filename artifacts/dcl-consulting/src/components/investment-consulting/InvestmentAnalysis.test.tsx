import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InvestmentAnalysis } from './InvestmentAnalysis';
import { investmentAnalysis } from '@/data/investment-consulting-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(name: string) {
  return name.toLowerCase().replaceAll(' ', '-');
}

describe('InvestmentAnalysis', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, intro, CTA, image, and all five rows', () => {
    mockDesktop(true);
    render(<InvestmentAnalysis />);
    expect(screen.getAllByText(investmentAnalysis.label).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('From information');
    expect(screen.getByText(investmentAnalysis.intro)).toBeInTheDocument();
    const cta = screen.getByTestId('link-investment-analysis-cta');
    expect(cta).toHaveTextContent(investmentAnalysis.cta.label);
    expect(cta).toHaveAttribute('href', investmentAnalysis.cta.href);
    expect(screen.getByTestId('img-investment-analysis')).toBeInTheDocument();
    for (const row of investmentAnalysis.rows) {
      expect(screen.getByTestId(`analysis-row-${slug(row.name)}`)).toHaveTextContent(row.name);
    }
  });

  it('activates the first row by default on desktop, and previews a different one on hover', () => {
    mockDesktop(true);
    render(<InvestmentAnalysis />);
    const first = screen.getByTestId(`analysis-row-${slug(investmentAnalysis.rows[0]!.name)}`);
    const third = screen.getByTestId(`analysis-row-${slug(investmentAnalysis.rows[2]!.name)}`);
    expect(first).toHaveAttribute('data-active', 'true');
    expect(third).toHaveAttribute('data-active', 'false');

    fireEvent.mouseEnter(third);
    expect(third).toHaveAttribute('data-active', 'true');

    fireEvent.mouseLeave(third);
    expect(first).toHaveAttribute('data-active', 'true');
  });

  it('treats every row as visually active on mobile', () => {
    mockDesktop(false);
    render(<InvestmentAnalysis />);
    for (const row of investmentAnalysis.rows) {
      expect(screen.getByTestId(`analysis-row-${slug(row.name)}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<InvestmentAnalysis />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<InvestmentAnalysis />);
    const section = document.getElementById('investment-analysis');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
