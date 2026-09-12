import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Expertise } from './Expertise';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('Expertise', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow tagline', () => {
    mockDesktop(true);
    render(<Expertise />);
    expect(screen.getByTestId('text-expertise-eyebrow')).toHaveTextContent('Our expertise');
  });

  it('renders all six services with no numbering', () => {
    mockDesktop(true);
    render(<Expertise />);
    for (const title of [
      'Investment Consulting',
      'Opportunity Analysis',
      'Risk & Opportunity Assessment',
      'Business & Financial Analysis',
      'Strategic Advisory',
      'Due Diligence Support',
    ]) {
      const row = screen.getByTestId(`row-expertise-${title.toLowerCase().replaceAll(/[^a-z]+/g, '-').replace(/(^-|-$)/g, '')}`);
      expect(row).toHaveTextContent(title);
    }
    expect(screen.queryByText(/^0[1-6]$/)).not.toBeInTheDocument();
  });

  it('marks a row active on focus (desktop)', () => {
    mockDesktop(true);
    render(<Expertise />);
    const row = screen.getByTestId('row-expertise-investment-consulting');
    fireEvent.focus(row);
    expect(row).toHaveAttribute('data-active', 'true');
    fireEvent.blur(row);
    expect(row).toHaveAttribute('data-active', 'false');
  });

  it('renders an accessible accordion on mobile', () => {
    mockDesktop(false);
    render(<Expertise />);
    const trigger = screen.getByTestId('button-expertise-investment-consulting');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});
