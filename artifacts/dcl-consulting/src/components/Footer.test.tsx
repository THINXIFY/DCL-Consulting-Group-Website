import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('links the mark home and renders the primary navigation', () => {
    render(<Footer />);
    expect(screen.getByTestId('link-footer-home')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('link-footer-about-us')).toHaveAttribute('href', '/about');
    expect(screen.getByTestId('link-footer-expertise')).toHaveAttribute('href', '/expertise');
    expect(screen.getByTestId('link-footer-our-approach')).toHaveAttribute('href', '/approach');
    expect(screen.getByTestId('link-footer-industries')).toHaveAttribute('href', '/#industries');
  });

  it('renders only the exact confirmed company registration facts, nothing invented', () => {
    render(<Footer />);
    expect(screen.getByTestId('text-footer-fact-company')).toHaveTextContent('DCL Consulting and Investments Limited');
    expect(screen.getByTestId('text-footer-fact-company-type')).toHaveTextContent('Private Limited Company');
    expect(screen.getByTestId('text-footer-fact-registered-in')).toHaveTextContent('England & Wales');
    expect(screen.getByTestId('text-footer-fact-company-number')).toHaveTextContent('10086906');
    expect(screen.queryByTestId('text-footer-fact-director')).not.toBeInTheDocument();
  });

  it('renders the current year in the copyright line', () => {
    render(<Footer />);
    expect(screen.getByTestId('text-footer-copyright')).toHaveTextContent(String(new Date().getFullYear()));
  });

  it('contains no em-dash characters', () => {
    render(<Footer />);
    const footer = document.querySelector('footer');
    expect(footer?.textContent).not.toMatch(/[–—]/);
  });
});
