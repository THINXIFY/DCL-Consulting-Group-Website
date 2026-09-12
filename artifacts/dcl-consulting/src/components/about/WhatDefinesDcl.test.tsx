import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WhatDefinesDcl } from './WhatDefinesDcl';

describe('WhatDefinesDcl', () => {
  it('renders the eyebrow, headline, all four principles, and the closing statement', () => {
    render(<WhatDefinesDcl />);
    expect(screen.getByTestId('text-defines-eyebrow')).toHaveTextContent('What defines DCL');
    expect(screen.getByText(/the quality of the view/i)).toBeInTheDocument();
    for (const title of ['Independent Perspective', 'Analytical Discipline', 'Commercial Understanding', 'Clear Communication']) {
      expect(screen.getByTestId(`defines-cell-${title.toLowerCase().replaceAll(' ', '-')}`)).toHaveTextContent(title);
    }
    expect(screen.getByTestId('text-defines-closing')).toHaveTextContent(/independent thinking/i);
  });

  it('brightens the hovered/focused principle and dims the others', () => {
    render(<WhatDefinesDcl />);
    const cell = screen.getByTestId('defines-cell-analytical-discipline');
    fireEvent.focus(cell);
    expect(cell).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('defines-cell-independent-perspective')).toHaveAttribute('data-active', 'false');
  });

  it('contains no numbering, cards, or em-dash characters', () => {
    render(<WhatDefinesDcl />);
    const section = document.getElementById('what-defines-dcl');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
