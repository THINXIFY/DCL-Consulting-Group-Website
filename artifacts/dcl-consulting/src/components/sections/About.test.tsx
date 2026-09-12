import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { About } from './About';

describe('About', () => {
  it('renders the eyebrow, headline, and company facts', () => {
    render(<About />);
    const section = document.getElementById('about');
    expect(section).not.toBeNull();
    expect(screen.getByTestId('text-about-eyebrow')).toHaveTextContent('About us');
    expect(screen.getByTestId('text-about-title')).toHaveTextContent(/clarity begins with understanding/i);
    expect(screen.getByText('Company no. 10086906')).toBeInTheDocument();
  });

  it('contains no em-dash characters', () => {
    render(<About />);
    const section = document.getElementById('about');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
