import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { whatWeValue } from '@/data/partners-content';
import { WhatWeValue } from './WhatWeValue';

describe('WhatWeValue', () => {
  it('renders the eyebrow, headline, intro, and all six principles with their copy always visible', () => {
    render(<WhatWeValue />);
    expect(screen.getByTestId('text-what-we-value-eyebrow')).toHaveTextContent('What We Value');
    for (const principle of whatWeValue.principles) {
      const row = screen.getByTestId(`what-we-value-${principle.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`);
      expect(row).toHaveTextContent(principle.name);
      expect(row).toHaveTextContent(principle.copy);
    }
  });

  it('works without hover: every row is focusable and content is present regardless of focus state', () => {
    render(<WhatWeValue />);
    const row = screen.getByTestId('what-we-value-independence');
    expect(row).toHaveTextContent('Independence');
    fireEvent.focus(row);
    expect(row).toHaveTextContent('Independence');
    fireEvent.blur(row);
    expect(row).toHaveTextContent('Independence');
  });

  it('contains no em-dash characters', () => {
    render(<WhatWeValue />);
    const section = document.getElementById('what-we-value');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
