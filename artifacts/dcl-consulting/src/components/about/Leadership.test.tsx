import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Leadership } from './Leadership';

describe('Leadership', () => {
  it('renders the eyebrow, headline, name, role, body copy, and all three approach principles as a triptych', () => {
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

  it('renders the exact three formal facts, nothing invented, and does not claim the image is a portrait', () => {
    render(<Leadership />);
    for (const [label, value] of [
      ['Director', 'David Christopher Lebond'],
      ['Company', 'DCL Consulting and Investments Limited'],
      ['Registered', 'England & Wales'],
    ]) {
      const row = screen.getByTestId(`leadership-fact-${label.toLowerCase()}`);
      expect(row).toHaveTextContent(label);
      expect(row).toHaveTextContent(value);
    }

    const image = screen.getByTestId('img-leadership-context');
    expect(image.getAttribute('alt')?.toLowerCase()).not.toContain('david');
    expect(image.getAttribute('alt')?.toLowerCase()).not.toContain('portrait');
  });

  it('contains no numbering or em-dash characters', () => {
    render(<Leadership />);
    const section = document.getElementById('leadership');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
