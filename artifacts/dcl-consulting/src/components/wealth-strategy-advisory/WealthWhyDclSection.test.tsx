import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WealthWhyDclSection } from './WealthWhyDclSection';
import { wealthWhyDcl } from '@/data/wealth-strategy-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('WealthWhyDclSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, image, and all four principles', () => {
    mockDesktop(true);
    render(<WealthWhyDclSection />);
    expect(screen.getByText(wealthWhyDcl.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A considered partner');
    expect(screen.getByText(wealthWhyDcl.body)).toBeInTheDocument();
    expect(screen.getByTestId('img-wealth-why-dcl')).toBeInTheDocument();
    for (const principle of wealthWhyDcl.principles) {
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
    expect(() => render(<WealthWhyDclSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WealthWhyDclSection />);
    const section = document.getElementById('wealth-why-dcl');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
