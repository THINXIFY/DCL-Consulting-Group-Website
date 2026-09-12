import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { About } from './About';

describe('About', () => {
  it('renders the headline and company facts with no eyebrow label', () => {
    render(<About />);
    const section = document.getElementById('about');
    expect(section).not.toBeNull();
    expect(screen.getByTestId('text-about-title')).toHaveTextContent(/clarity begins with understanding/i);
    expect(screen.getByText('Company no. 10086906')).toBeInTheDocument();
    expect(section?.querySelector('.dclHome__eyebrow')).toBeNull();
  });

  it('contains no em-dash characters', () => {
    render(<About />);
    const section = document.getElementById('about');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
