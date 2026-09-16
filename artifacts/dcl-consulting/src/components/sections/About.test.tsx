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

  it('renders the three principles and the real supporting image', () => {
    render(<About />);
    for (const title of ['Independent', 'Disciplined', 'Considered']) {
      expect(screen.getByTestId(`about-principle-${title.toLowerCase()}`)).toHaveTextContent(title);
    }
    const img = document.querySelector('.dclAbout__imageWrap img');
    expect(img).toHaveAttribute('src', expect.stringContaining('/images/home/'));
  });

  it('contains no em-dash characters', () => {
    render(<About />);
    const section = document.getElementById('about');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
