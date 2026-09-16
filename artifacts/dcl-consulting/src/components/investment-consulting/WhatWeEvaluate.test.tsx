import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhatWeEvaluate } from './WhatWeEvaluate';
import { whatWeEvaluate } from '@/data/investment-consulting-content';

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

describe('WhatWeEvaluate', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all five evaluation areas', () => {
    mockDesktop(true);
    render(<WhatWeEvaluate />);
    expect(screen.getByText(whatWeEvaluate.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Key elements');
    for (const area of whatWeEvaluate.areas) {
      const el = screen.getByTestId(`evaluate-area-${slug(area.name)}`);
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
    expect(() => render(<WhatWeEvaluate />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WhatWeEvaluate />);
    const section = document.getElementById('what-we-evaluate');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
