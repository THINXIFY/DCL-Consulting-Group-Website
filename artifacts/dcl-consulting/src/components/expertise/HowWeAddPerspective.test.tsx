import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HowWeAddPerspective } from './HowWeAddPerspective';
import { fourLenses } from '@/data/expertise-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(title: string) {
  return title.toLowerCase().replaceAll(' ', '-');
}

describe('HowWeAddPerspective', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, intro, approach link, and all four lenses with images', () => {
    mockDesktop(true);
    render(<HowWeAddPerspective />);
    expect(screen.getByText(fourLenses.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Four lenses.');
    expect(screen.getByText(fourLenses.intro)).toBeInTheDocument();
    expect(screen.getByTestId('link-lenses-approach')).toHaveAttribute('href', '/approach');

    for (const lens of fourLenses.lenses) {
      const panel = screen.getByTestId(`lens-panel-${slug(lens.title)}`);
      expect(panel).toHaveTextContent(lens.title);
      expect(panel).toHaveTextContent(lens.description);
      expect(screen.getByTestId(`img-lens-${slug(lens.title)}`)).toBeInTheDocument();
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<HowWeAddPerspective />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<HowWeAddPerspective />);
    const section = document.getElementById('four-lenses');
    expect(section?.textContent).not.toMatch(/[–—]/);
    expect(section?.textContent).not.toMatch(/(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i);
  });
});
