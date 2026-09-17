import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { About } from './About';

describe('About', () => {
  it('renders the eyebrow, headline, supporting line, and body copy', () => {
    render(<About />);
    const section = document.getElementById('about');
    expect(section).not.toBeNull();
    expect(screen.getByTestId('text-about-eyebrow')).toHaveTextContent('About us');
    expect(screen.getByTestId('text-about-title')).toHaveTextContent(/clarity begins with.*understanding/i);
    expect(section?.textContent).toMatch(/a considered perspective, for decisions that deserve one/i);
    expect(section?.textContent).toMatch(/quietly independent and deliberately close to the work/i);
  });

  it('renders the Learn More CTA routing to /about', () => {
    render(<About />);
    const link = screen.getByTestId('link-about-learn-more');
    expect(link).toHaveTextContent('Learn More');
    expect(link).toHaveAttribute('href', '/about');
  });

  it('renders the real supporting image', () => {
    render(<About />);
    const img = screen.getByTestId('img-about');
    expect(img).toHaveAttribute('src', expect.stringMatching(/^https:\/\//));
    expect(img).toHaveAttribute('alt', expect.stringMatching(/.+/));
  });

  it('renders the floating company information panel with the three real company facts', () => {
    render(<About />);
    const panel = screen.getByTestId('panel-about-company');
    expect(panel).toHaveTextContent('DCL Consulting and Investments Limited');
    expect(screen.getByTestId('about-fact-private-limited-company')).toHaveTextContent('Private limited company');
    expect(screen.getByTestId('about-fact-registered-in-england-and-wales')).toHaveTextContent('Registered in England and Wales');
    expect(screen.getByTestId('about-fact-company-no-10086906')).toHaveTextContent('Company no. 10086906');
  });

  it('contains no em-dash characters', () => {
    render(<About />);
    const section = document.getElementById('about');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
