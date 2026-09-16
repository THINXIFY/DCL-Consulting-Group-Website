import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TransactionFocusSection } from './TransactionFocusSection';
import { transactionFocus } from '@/data/ma-acquisition-advisory-content';

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

describe('TransactionFocusSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four transaction focus areas, without implying brokerage or execution', () => {
    mockDesktop(true);
    render(<TransactionFocusSection />);
    expect(screen.getByText(transactionFocus.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Focused support across');
    for (const area of transactionFocus.areas) {
      const el = screen.getByTestId(`transaction-focus-area-${slug(area.name)}`);
      expect(el).toHaveTextContent(area.name);
      expect(el).toHaveTextContent(area.description);
    }
    const section = document.getElementById('transaction-focus');
    expect(section?.textContent?.toLowerCase()).not.toMatch(/brokerage|we execute/);
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<TransactionFocusSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<TransactionFocusSection />);
    const section = document.getElementById('transaction-focus');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
