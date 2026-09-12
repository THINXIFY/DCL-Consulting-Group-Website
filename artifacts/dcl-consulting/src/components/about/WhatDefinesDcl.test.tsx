import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhatDefinesDcl } from './WhatDefinesDcl';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('WhatDefinesDcl', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, intro, all four principle titles, and the closing statement', () => {
    mockDesktop(true);
    render(<WhatDefinesDcl />);
    expect(screen.getByTestId('text-defines-eyebrow')).toHaveTextContent('What defines DCL');
    expect(screen.getByText(/the quality of the view/i)).toBeInTheDocument();
    expect(screen.getByText(/dcl's work is guided by a small number of principles/i)).toBeInTheDocument();
    for (const title of ['Independent Perspective', 'Analytical Discipline', 'Commercial Understanding', 'Clear Communication']) {
      expect(screen.getByTestId(`defines-row-${title.toLowerCase().replaceAll(' ', '-')}`)).toHaveTextContent(title);
    }
    expect(screen.getByTestId('text-defines-closing')).toHaveTextContent(/independent thinking/i);
  });

  it('keeps the left statement static while expanding only the active row on the right', () => {
    mockDesktop(true);
    render(<WhatDefinesDcl />);
    const row = screen.getByTestId('defines-row-analytical-discipline');
    expect(row).toHaveAttribute('data-active', 'false');
    fireEvent.focus(row);
    expect(row).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('defines-row-independent-perspective')).toHaveAttribute('data-active', 'false');
  });

  it('shows every principle expanded on mobile with no interaction required', () => {
    mockDesktop(false);
    render(<WhatDefinesDcl />);
    for (const title of ['Independent Perspective', 'Analytical Discipline', 'Commercial Understanding', 'Clear Communication']) {
      expect(screen.getByTestId(`defines-row-${title.toLowerCase().replaceAll(' ', '-')}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WhatDefinesDcl />);
    const section = document.getElementById('what-defines-dcl');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
