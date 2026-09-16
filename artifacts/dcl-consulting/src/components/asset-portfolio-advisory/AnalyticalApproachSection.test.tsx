import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AnalyticalApproachSection } from './AnalyticalApproachSection';
import { analyticalApproach } from '@/data/asset-portfolio-advisory-content';

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

describe('AnalyticalApproachSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, CTA, and all five rows with no decorative numbering', () => {
    mockDesktop(true);
    render(<AnalyticalApproachSection />);
    expect(screen.getByText(analyticalApproach.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A structured process');
    expect(screen.getByText(analyticalApproach.body)).toBeInTheDocument();
    const cta = screen.getByTestId('link-analytical-approach-cta');
    expect(cta).toHaveTextContent(analyticalApproach.cta.label);
    expect(cta).toHaveAttribute('href', analyticalApproach.cta.href);
    for (const row of analyticalApproach.rows) {
      const el = screen.getByTestId(`analytical-row-${slug(row.name)}`);
      expect(el).toHaveTextContent(row.name);
      expect(el).toHaveTextContent(row.description);
      expect(el.textContent).not.toMatch(/^\d/);
    }
  });

  it('activates the first row by default on desktop, and previews a different one on hover', () => {
    mockDesktop(true);
    render(<AnalyticalApproachSection />);
    const first = screen.getByTestId(`analytical-row-${slug(analyticalApproach.rows[0]!.name)}`);
    const third = screen.getByTestId(`analytical-row-${slug(analyticalApproach.rows[2]!.name)}`);
    expect(first).toHaveAttribute('data-active', 'true');
    expect(third).toHaveAttribute('data-active', 'false');

    fireEvent.mouseEnter(third);
    expect(third).toHaveAttribute('data-active', 'true');

    fireEvent.mouseLeave(third);
    expect(first).toHaveAttribute('data-active', 'true');
  });

  it('treats every row as visually active on mobile', () => {
    mockDesktop(false);
    render(<AnalyticalApproachSection />);
    for (const row of analyticalApproach.rows) {
      expect(screen.getByTestId(`analytical-row-${slug(row.name)}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<AnalyticalApproachSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<AnalyticalApproachSection />);
    const section = document.getElementById('analytical-approach');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
