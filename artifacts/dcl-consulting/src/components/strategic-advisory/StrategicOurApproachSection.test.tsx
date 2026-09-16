import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StrategicOurApproachSection } from './StrategicOurApproachSection';
import { strategicOurApproach } from '@/data/strategic-advisory-content';

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

describe('StrategicOurApproachSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, CTA, and all four rows with no decorative numbering', () => {
    mockDesktop(true);
    render(<StrategicOurApproachSection />);
    expect(screen.getByText(strategicOurApproach.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('From insight');
    expect(screen.getByText(strategicOurApproach.body)).toBeInTheDocument();
    const cta = screen.getByTestId('link-strategic-approach-cta');
    expect(cta).toHaveTextContent(strategicOurApproach.cta.label);
    expect(cta).toHaveAttribute('href', strategicOurApproach.cta.href);
    for (const row of strategicOurApproach.rows) {
      const el = screen.getByTestId(`strategic-approach-row-${slug(row.name)}`);
      expect(el).toHaveTextContent(row.name);
      expect(el).toHaveTextContent(row.description);
    }
  });

  it('activates the first row by default on desktop, and previews a different one on hover', () => {
    mockDesktop(true);
    render(<StrategicOurApproachSection />);
    const first = screen.getByTestId(`strategic-approach-row-${slug(strategicOurApproach.rows[0]!.name)}`);
    const third = screen.getByTestId(`strategic-approach-row-${slug(strategicOurApproach.rows[2]!.name)}`);
    expect(first).toHaveAttribute('data-active', 'true');
    expect(third).toHaveAttribute('data-active', 'false');

    fireEvent.mouseEnter(third);
    expect(third).toHaveAttribute('data-active', 'true');

    fireEvent.mouseLeave(third);
    expect(first).toHaveAttribute('data-active', 'true');
  });

  it('treats every row as visually active on mobile', () => {
    mockDesktop(false);
    render(<StrategicOurApproachSection />);
    for (const row of strategicOurApproach.rows) {
      expect(screen.getByTestId(`strategic-approach-row-${slug(row.name)}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<StrategicOurApproachSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<StrategicOurApproachSection />);
    const section = document.getElementById('strategic-our-approach');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
