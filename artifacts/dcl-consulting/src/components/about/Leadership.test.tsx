import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Leadership } from './Leadership';

describe('Leadership', () => {
  it('renders the eyebrow, headline, name, role, body copy, and all three principles', () => {
    render(<Leadership />);
    expect(screen.getByTestId('text-leadership-eyebrow')).toHaveTextContent('Leadership');
    expect(screen.getByText(/leadership grounded/i)).toBeInTheDocument();
    expect(screen.getByTestId('text-leadership-name')).toHaveTextContent('David Christopher Lebond');
    expect(screen.getByTestId('text-leadership-role')).toHaveTextContent('Director');
    expect(screen.getByTestId('text-leadership-role')).toHaveTextContent('DCL Consulting and Investments Limited');
    expect(screen.getByText(/is led by david christopher lebond/i)).toBeInTheDocument();

    const principles = screen.getAllByTestId(/^leadership-principle-/);
    expect(principles).toHaveLength(3);
    expect(principles[0]).toHaveTextContent('Understand before concluding.');
    expect(principles[1]).toHaveTextContent('Challenge where necessary.');
    expect(principles[2]).toHaveTextContent('Communicate what matters clearly.');
  });

  it('does not render any image (typography-led, no fabricated portrait)', () => {
    render(<Leadership />);
    expect(document.querySelectorAll('img')).toHaveLength(0);
  });

  it('does not invent biography, career history, or credentials', () => {
    render(<Leadership />);
    const section = document.getElementById('leadership');
    const text = section?.textContent?.toLowerCase() ?? '';
    for (const forbidden of ['award', 'qualification', 'years of experience', 'ceo', 'founder of']) {
      expect(text).not.toContain(forbidden);
    }
  });

  it('contains no numbering or em-dash characters', () => {
    render(<Leadership />);
    const section = document.getElementById('leadership');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
