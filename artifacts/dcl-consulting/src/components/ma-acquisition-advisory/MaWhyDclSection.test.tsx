import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MaWhyDclSection } from './MaWhyDclSection';
import { maWhyDcl } from '@/data/ma-acquisition-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('MaWhyDclSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, image, and all four principles', () => {
    mockDesktop(true);
    render(<MaWhyDclSection />);
    expect(screen.getByText(maWhyDcl.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A disciplined approach');
    expect(screen.getByText(maWhyDcl.body)).toBeInTheDocument();
    expect(screen.getByTestId('img-ma-why-dcl')).toBeInTheDocument();
    for (const principle of maWhyDcl.principles) {
      expect(screen.getByText(principle)).toBeInTheDocument();
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<MaWhyDclSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<MaWhyDclSection />);
    const section = document.getElementById('ma-why-dcl');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
