import { render, screen } from '@testing-library/react';
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

  it('renders the headline, intro, all four principle titles, and the closing statement', () => {
    mockDesktop(true);
    render(<WhatDefinesDcl />);
    expect(screen.getByText(/the quality of the view/i)).toBeInTheDocument();
    expect(screen.getByText(/small number of principles/i)).toBeInTheDocument();
    for (const title of ['Independent Perspective', 'Analytical Discipline', 'Commercial Understanding', 'Clear Communication']) {
      expect(screen.getByTestId(`defines-row-${title.toLowerCase().replaceAll(' ', '-')}`)).toHaveTextContent(title);
    }
    const closing = screen.getByTestId('text-defines-closing');
    expect(closing).toHaveTextContent('Independent thinking.');
    expect(closing).toHaveTextContent('Structured judgement.');
    expect(closing).toHaveTextContent('Clear communication.');
  });

  it('keeps every principle description in the document (accessible without hover) on mobile', () => {
    mockDesktop(false);
    render(<WhatDefinesDcl />);
    expect(screen.getByText(/considered view shaped by the opportunity/i)).toBeInTheDocument();
    expect(screen.getByText(/how businesses, markets and opportunities work in practice/i)).toBeInTheDocument();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WhatDefinesDcl />);
    const section = document.getElementById('what-defines-dcl');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
