import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WhoWeAre } from './WhoWeAre';

describe('WhoWeAre', () => {
  it('renders the eyebrow, headline, lead, both body paragraphs, and closing statement', () => {
    render(<WhoWeAre />);
    const section = document.getElementById('who-we-are');
    expect(section).not.toBeNull();
    expect(screen.getByTestId('text-whoweare-eyebrow')).toHaveTextContent('Who we are');

    const title = screen.getByTestId('text-whoweare-title');
    expect(title).toHaveTextContent(/independent thinking/i);
    expect(title).toHaveTextContent(/for decisions that matter/i);

    expect(screen.getByText(/develop a clearer understanding of opportunities/i)).toBeInTheDocument();
    expect(screen.getByText(/understanding the commercial fundamentals/i)).toBeInTheDocument();
    expect(screen.getByText(/rather than approaching every situation/i)).toBeInTheDocument();
    expect(screen.getByTestId('text-whoweare-closing')).toHaveTextContent(/a better-informed view/i);
  });

  it('contains no numbering or em-dash characters', () => {
    render(<WhoWeAre />);
    const section = document.getElementById('who-we-are');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
