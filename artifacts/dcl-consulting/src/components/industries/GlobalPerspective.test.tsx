import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GlobalPerspective } from './GlobalPerspective';
import { globalPerspective } from '@/data/industries-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('GlobalPerspective', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, copy, CTA, and image', () => {
    mockDesktop(true);
    render(<GlobalPerspective />);
    expect(screen.getByText(globalPerspective.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Opportunities');
    expect(screen.getByText(globalPerspective.copy)).toBeInTheDocument();
    const cta = screen.getByTestId('link-global-perspective-cta');
    expect(cta).toHaveTextContent(globalPerspective.cta.label);
    expect(cta).toHaveAttribute('href', globalPerspective.cta.href);
    expect(screen.getByTestId('img-global-perspective')).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<GlobalPerspective />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<GlobalPerspective />);
    const section = document.getElementById('global-perspective');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
