import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Header } from './Header';

function setPath(path: string) {
  window.history.pushState({}, '', path);
}

describe('Header', () => {
  afterEach(() => setPath('/'));

  it('renders the primary nav links with no numbering', () => {
    render(<Header />);
    for (const label of ['About us', 'Expertise', 'Our approach', 'Industries']) {
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

  it('links the logo home, "About us" to /about, "Expertise" to /expertise, and "Our approach" to /approach, keeping Industries as a same-page anchor', () => {
    render(<Header />);
    expect(screen.getByTestId('link-home')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('link-nav-about-us')).toHaveAttribute('href', '/about');
    expect(screen.getByTestId('link-nav-expertise')).toHaveAttribute('href', '/expertise');
    expect(screen.getByTestId('link-nav-our-approach')).toHaveAttribute('href', '/approach');
    expect(screen.getByTestId('link-nav-industries')).toHaveAttribute('href', '#industries');
  });

  it('marks Our approach as the active nav item when on /approach', () => {
    setPath('/approach');
    render(<Header />);
    expect(screen.getByTestId('link-nav-our-approach')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByTestId('link-nav-about-us')).not.toHaveAttribute('aria-current');

    fireEvent.click(screen.getByTestId('button-mobile-menu'));
    expect(screen.getByTestId('link-mobile-our-approach')).toHaveAttribute('aria-current', 'page');
  });

  it('marks Expertise as the active nav item when on /expertise, on both desktop and mobile nav', () => {
    setPath('/expertise');
    render(<Header />);
    expect(screen.getByTestId('link-nav-expertise')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByTestId('link-nav-about-us')).not.toHaveAttribute('aria-current');

    fireEvent.click(screen.getByTestId('button-mobile-menu'));
    expect(screen.getByTestId('link-mobile-expertise')).toHaveAttribute('aria-current', 'page');
  });

  it('marks About as the active nav item when on /about, and Expertise as inactive', () => {
    setPath('/about');
    render(<Header />);
    expect(screen.getByTestId('link-nav-about-us')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByTestId('link-nav-expertise')).not.toHaveAttribute('aria-current');
  });
});
