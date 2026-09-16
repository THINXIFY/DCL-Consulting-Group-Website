import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InvestmentFocusSection } from './InvestmentFocusSection';
import { investmentFocus } from '@/data/private-capital-advisory-content';

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

describe('InvestmentFocusSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four focus areas', () => {
    mockDesktop(true);
    render(<InvestmentFocusSection />);
    expect(screen.getByText(investmentFocus.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Targeted support across');
    for (const area of investmentFocus.areas) {
      const el = screen.getByTestId(`focus-area-${slug(area.name)}`);
      expect(el).toHaveTextContent(area.name);
      expect(el).toHaveTextContent(area.description);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<InvestmentFocusSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<InvestmentFocusSection />);
    const section = document.getElementById('investment-focus');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
