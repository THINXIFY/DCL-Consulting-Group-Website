import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HowWeEvaluate } from './HowWeEvaluate';
import { howWeEvaluate } from '@/data/real-estate-investment-advisory-content';

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

describe('HowWeEvaluate', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, intro, image, and all five rows', () => {
    mockDesktop(true);
    render(<HowWeEvaluate />);
    expect(screen.getByText(howWeEvaluate.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A disciplined');
    expect(screen.getByText(howWeEvaluate.intro)).toBeInTheDocument();
    expect(screen.getByTestId('img-how-we-evaluate')).toBeInTheDocument();
    for (const row of howWeEvaluate.rows) {
      const el = screen.getByTestId(`evaluate-row-${slug(row.name)}`);
      expect(el).toHaveTextContent(row.name);
      expect(el).toHaveTextContent(row.description);
    }
  });

  it('activates the first row by default on desktop, and previews a different one on hover', () => {
    mockDesktop(true);
    render(<HowWeEvaluate />);
    const first = screen.getByTestId(`evaluate-row-${slug(howWeEvaluate.rows[0]!.name)}`);
    const third = screen.getByTestId(`evaluate-row-${slug(howWeEvaluate.rows[2]!.name)}`);
    expect(first).toHaveAttribute('data-active', 'true');
    expect(third).toHaveAttribute('data-active', 'false');

    fireEvent.mouseEnter(third);
    expect(third).toHaveAttribute('data-active', 'true');

    fireEvent.mouseLeave(third);
    expect(first).toHaveAttribute('data-active', 'true');
  });

  it('treats every row as visually active on mobile', () => {
    mockDesktop(false);
    render(<HowWeEvaluate />);
    for (const row of howWeEvaluate.rows) {
      expect(screen.getByTestId(`evaluate-row-${slug(row.name)}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<HowWeEvaluate />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<HowWeEvaluate />);
    const section = document.getElementById('how-we-evaluate');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
