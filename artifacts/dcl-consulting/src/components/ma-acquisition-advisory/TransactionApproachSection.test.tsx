import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TransactionApproachSection } from './TransactionApproachSection';
import { transactionApproach } from '@/data/ma-acquisition-advisory-content';

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

describe('TransactionApproachSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, body, CTA, and all four rows with no decorative numbering', () => {
    mockDesktop(true);
    render(<TransactionApproachSection />);
    expect(screen.getByText(transactionApproach.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('From opportunity');
    expect(screen.getByText(transactionApproach.body)).toBeInTheDocument();
    const cta = screen.getByTestId('link-transaction-approach-cta');
    expect(cta).toHaveTextContent(transactionApproach.cta.label);
    expect(cta).toHaveAttribute('href', transactionApproach.cta.href);
    for (const row of transactionApproach.rows) {
      const el = screen.getByTestId(`transaction-approach-row-${slug(row.name)}`);
      expect(el).toHaveTextContent(row.name);
      expect(el).toHaveTextContent(row.description);
    }
  });

  it('activates the first row by default on desktop, and previews a different one on hover', () => {
    mockDesktop(true);
    render(<TransactionApproachSection />);
    const first = screen.getByTestId(`transaction-approach-row-${slug(transactionApproach.rows[0]!.name)}`);
    const third = screen.getByTestId(`transaction-approach-row-${slug(transactionApproach.rows[2]!.name)}`);
    expect(first).toHaveAttribute('data-active', 'true');
    expect(third).toHaveAttribute('data-active', 'false');

    fireEvent.mouseEnter(third);
    expect(third).toHaveAttribute('data-active', 'true');

    fireEvent.mouseLeave(third);
    expect(first).toHaveAttribute('data-active', 'true');
  });

  it('treats every row as visually active on mobile', () => {
    mockDesktop(false);
    render(<TransactionApproachSection />);
    for (const row of transactionApproach.rows) {
      expect(screen.getByTestId(`transaction-approach-row-${slug(row.name)}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<TransactionApproachSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<TransactionApproachSection />);
    const section = document.getElementById('transaction-approach');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
