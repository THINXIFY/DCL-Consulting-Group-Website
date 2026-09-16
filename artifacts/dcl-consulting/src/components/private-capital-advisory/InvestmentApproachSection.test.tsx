import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InvestmentApproachSection } from './InvestmentApproachSection';
import { investmentApproach } from '@/data/private-capital-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

describe('InvestmentApproachSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, CTA, and all four rows with no decorative numbering', () => {
    mockDesktop(true);
    render(<InvestmentApproachSection />);
    expect(screen.getByText(investmentApproach.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('From opportunity');
    expect(screen.getByText(investmentApproach.body)).toBeInTheDocument();
    const cta = screen.getByTestId('link-investment-approach-cta');
    expect(cta).toHaveTextContent(investmentApproach.cta.label);
    expect(cta).toHaveAttribute('href', investmentApproach.cta.href);
    for (const row of investmentApproach.rows) {
      const el = screen.getByTestId(`pc-approach-row-${slug(row.name)}`);
      expect(el).toHaveTextContent(row.name);
      expect(el).toHaveTextContent(row.description);
    }
  });

  it('activates the first row by default on desktop, and previews a different one on hover', () => {
    mockDesktop(true);
    render(<InvestmentApproachSection />);
    const first = screen.getByTestId(`pc-approach-row-${slug(investmentApproach.rows[0]!.name)}`);
    const third = screen.getByTestId(`pc-approach-row-${slug(investmentApproach.rows[2]!.name)}`);
    expect(first).toHaveAttribute('data-active', 'true');
    expect(third).toHaveAttribute('data-active', 'false');

    fireEvent.mouseEnter(third);
    expect(third).toHaveAttribute('data-active', 'true');

    fireEvent.mouseLeave(third);
    expect(first).toHaveAttribute('data-active', 'true');
  });

  it('treats every row as visually active on mobile', () => {
    mockDesktop(false);
    render(<InvestmentApproachSection />);
    for (const row of investmentApproach.rows) {
      expect(screen.getByTestId(`pc-approach-row-${slug(row.name)}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<InvestmentApproachSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<InvestmentApproachSection />);
    const section = document.getElementById('investment-approach');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
