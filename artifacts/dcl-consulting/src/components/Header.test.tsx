import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('renders the primary nav links with no numbering', () => {
    render(<Header />);
    for (const label of ['About us', 'Our expertise', 'Our approach', 'Industries']) {
      const link = screen.getByTestId(`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`);
      expect(link).toHaveTextContent(label);
      expect(link.textContent).not.toMatch(/\d/);
    }
  });

  it('toggles the mobile menu on click', () => {
    render(<Header />);
    const button = screen.getByTestId('button-mobile-menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('link-mobile-about-us')).toBeInTheDocument();
  });

  it('links the logo home and keeps all nav links as same-page anchors', () => {
    render(<Header />);
    expect(screen.getByTestId('link-home')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('link-nav-about-us')).toHaveAttribute('href', '#about');
    expect(screen.getByTestId('link-nav-our-expertise')).toHaveAttribute('href', '#expertise');
  });
});
