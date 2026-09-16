import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhatWeLookFor } from './WhatWeLookFor';
import { whatWeLookFor } from '@/data/industries-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

describe('WhatWeLookFor', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the headline and all six evaluation factors', () => {
    mockDesktop(true);
    render(<WhatWeLookFor />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('The sector changes.');
    for (const factor of whatWeLookFor.factors) {
      const el = screen.getByTestId(`look-for-factor-${slug(factor.name)}`);
      expect(el).toHaveTextContent(factor.name);
      expect(el).toHaveTextContent(factor.description);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<WhatWeLookFor />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WhatWeLookFor />);
    const section = document.getElementById('what-we-look-for');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
