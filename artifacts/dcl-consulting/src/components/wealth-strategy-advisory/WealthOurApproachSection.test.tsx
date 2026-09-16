import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WealthOurApproachSection } from './WealthOurApproachSection';
import { wealthOurApproach } from '@/data/wealth-strategy-advisory-content';

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

describe('WealthOurApproachSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, CTA, and all four rows with no decorative numbering', () => {
    mockDesktop(true);
    render(<WealthOurApproachSection />);
    expect(screen.getAllByText(wealthOurApproach.label).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A structured process');
    expect(screen.getByText(wealthOurApproach.body)).toBeInTheDocument();
    const cta = screen.getByTestId('link-wealth-approach-cta');
    expect(cta).toHaveTextContent(wealthOurApproach.cta.label);
    expect(cta).toHaveAttribute('href', wealthOurApproach.cta.href);
    for (const row of wealthOurApproach.rows) {
      const el = screen.getByTestId(`wealth-approach-row-${slug(row.name)}`);
      expect(el).toHaveTextContent(row.name);
      expect(el).toHaveTextContent(row.description);
    }
  });

  it('activates the first row by default on desktop, and previews a different one on hover', () => {
    mockDesktop(true);
    render(<WealthOurApproachSection />);
    const first = screen.getByTestId(`wealth-approach-row-${slug(wealthOurApproach.rows[0]!.name)}`);
    const third = screen.getByTestId(`wealth-approach-row-${slug(wealthOurApproach.rows[2]!.name)}`);
    expect(first).toHaveAttribute('data-active', 'true');
    expect(third).toHaveAttribute('data-active', 'false');

    fireEvent.mouseEnter(third);
    expect(third).toHaveAttribute('data-active', 'true');

    fireEvent.mouseLeave(third);
    expect(first).toHaveAttribute('data-active', 'true');
  });

  it('treats every row as visually active on mobile', () => {
    mockDesktop(false);
    render(<WealthOurApproachSection />);
    for (const row of wealthOurApproach.rows) {
      expect(screen.getByTestId(`wealth-approach-row-${slug(row.name)}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<WealthOurApproachSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WealthOurApproachSection />);
    const section = document.getElementById('wealth-our-approach');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
