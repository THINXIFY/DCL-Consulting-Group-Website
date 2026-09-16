import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RiskOurApproachSection } from './RiskOurApproachSection';
import { riskOurApproach } from '@/data/risk-opportunity-assessment-content';

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

describe('RiskOurApproachSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, CTA, and all four rows with no decorative numbering', () => {
    mockDesktop(true);
    render(<RiskOurApproachSection />);
    expect(screen.getByText(riskOurApproach.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A structured lens');
    expect(screen.getByText(riskOurApproach.body)).toBeInTheDocument();
    const cta = screen.getByTestId('link-risk-approach-cta');
    expect(cta).toHaveTextContent(riskOurApproach.cta.label);
    expect(cta).toHaveAttribute('href', riskOurApproach.cta.href);
    for (const row of riskOurApproach.rows) {
      const el = screen.getByTestId(`risk-approach-row-${slug(row.name)}`);
      expect(el).toHaveTextContent(row.name);
      expect(el).toHaveTextContent(row.description);
    }
  });

  it('activates the first row by default on desktop, and previews a different one on hover', () => {
    mockDesktop(true);
    render(<RiskOurApproachSection />);
    const first = screen.getByTestId(`risk-approach-row-${slug(riskOurApproach.rows[0]!.name)}`);
    const third = screen.getByTestId(`risk-approach-row-${slug(riskOurApproach.rows[2]!.name)}`);
    expect(first).toHaveAttribute('data-active', 'true');
    expect(third).toHaveAttribute('data-active', 'false');

    fireEvent.mouseEnter(third);
    expect(third).toHaveAttribute('data-active', 'true');

    fireEvent.mouseLeave(third);
    expect(first).toHaveAttribute('data-active', 'true');
  });

  it('treats every row as visually active on mobile', () => {
    mockDesktop(false);
    render(<RiskOurApproachSection />);
    for (const row of riskOurApproach.rows) {
      expect(screen.getByTestId(`risk-approach-row-${slug(row.name)}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<RiskOurApproachSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<RiskOurApproachSection />);
    const section = document.getElementById('risk-our-approach');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
