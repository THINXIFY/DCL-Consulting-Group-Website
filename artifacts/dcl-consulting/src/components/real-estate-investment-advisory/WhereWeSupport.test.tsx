import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhereWeSupport } from './WhereWeSupport';
import { whereWeSupport } from '@/data/real-estate-investment-advisory-content';

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

describe('WhereWeSupport', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all five support areas', () => {
    mockDesktop(true);
    render(<WhereWeSupport />);
    expect(screen.getByText(whereWeSupport.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Across the real-estate');
    for (const area of whereWeSupport.areas) {
      const el = screen.getByTestId(`support-area-${slug(area.name)}`);
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
    expect(() => render(<WhereWeSupport />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WhereWeSupport />);
    const section = document.getElementById('where-we-support');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
