import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WorkingWithDcl } from './WorkingWithDcl';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const PRINCIPLES = ['defined-scope', 'relevant-information', 'direct-communication', 'decision-focused-output'];

describe('WorkingWithDcl', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the headline, intro, all four engagement principles, and the closing statement', () => {
    mockDesktop(true);
    render(<WorkingWithDcl />);
    expect(screen.getByText(/a focused engagement/i)).toBeInTheDocument();
    expect(screen.getByText(/dcl engagements are shaped around/i)).toBeInTheDocument();
    for (const id of PRINCIPLES) {
      expect(screen.getByTestId(`working-row-${id}`)).toBeInTheDocument();
    }
    const closing = screen.getByTestId('text-working-closing');
    expect(closing).toHaveTextContent('The scope may change.');
    expect(closing).toHaveTextContent('The standard of thinking should not.');
  });

  it('activates Defined Scope by default on desktop, and previews a different row on hover', () => {
    mockDesktop(true);
    render(<WorkingWithDcl />);
    expect(screen.getByTestId('working-row-defined-scope')).toHaveAttribute('data-active', 'true');

    fireEvent.mouseEnter(screen.getByTestId('working-row-decision-focused-output'));
    expect(screen.getByTestId('working-row-decision-focused-output')).toHaveAttribute('data-active', 'true');
    expect(screen.getByText(/conclude with a structured perspective/i)).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByTestId('working-row-decision-focused-output'));
    expect(screen.getByTestId('working-row-defined-scope')).toHaveAttribute('data-active', 'true');
  });

  it('keeps every principle description accessible without hover on mobile', () => {
    mockDesktop(false);
    render(<WorkingWithDcl />);
    for (const id of PRINCIPLES) {
      expect(screen.getByTestId(`working-row-${id}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WorkingWithDcl />);
    const section = document.getElementById('working-with-dcl');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
