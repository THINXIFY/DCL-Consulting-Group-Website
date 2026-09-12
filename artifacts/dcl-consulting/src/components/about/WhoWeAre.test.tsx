import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WhoWeAre } from './WhoWeAre';

describe('WhoWeAre', () => {
  it('renders the eyebrow, headline, lead statement, both body paragraphs, image, and closing statement', () => {
    render(<WhoWeAre />);
    const section = document.getElementById('who-we-are');
    expect(section).not.toBeNull();
    expect(screen.getByTestId('text-whoweare-eyebrow')).toHaveTextContent('Who we are');

    const title = screen.getByTestId('text-whoweare-title');
    expect(title).toHaveTextContent('Independent thinking');
    expect(title).toHaveTextContent('for decisions that matter.');

    expect(screen.getByTestId('text-whoweare-lead')).toHaveTextContent(/develop a clearer understanding of opportunities/i);
    expect(screen.getByText(/understanding the commercial fundamentals/i)).toBeInTheDocument();
    expect(screen.getByText(/rather than approaching every situation/i)).toBeInTheDocument();

    const image = screen.getByTestId('img-whoweare');
    expect(image.getAttribute('alt')?.toLowerCase()).not.toMatch(/mountain|forest|tree|landscape|nature|handshake/);

    expect(screen.getByTestId('text-whoweare-closing')).toHaveTextContent(/a better-informed view/i);
  });

  it('contains no numbering or em-dash characters', () => {
    render(<WhoWeAre />);
    const section = document.getElementById('who-we-are');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
