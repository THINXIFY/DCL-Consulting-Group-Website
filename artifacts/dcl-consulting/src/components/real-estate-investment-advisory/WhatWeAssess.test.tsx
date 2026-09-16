import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhatWeAssess } from './WhatWeAssess';
import { whatWeAssess } from '@/data/real-estate-investment-advisory-content';

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

describe('WhatWeAssess', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four assessment areas', () => {
    mockDesktop(true);
    render(<WhatWeAssess />);
    expect(screen.getByText(whatWeAssess.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A holistic view');
    for (const area of whatWeAssess.areas) {
      const el = screen.getByTestId(`assess-area-${slug(area.name)}`);
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
    expect(() => render(<WhatWeAssess />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WhatWeAssess />);
    const section = document.getElementById('what-we-assess');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
