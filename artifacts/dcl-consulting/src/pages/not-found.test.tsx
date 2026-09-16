import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { notFoundContent } from '@/data/not-found-content';
import NotFound from './not-found';

describe('NotFound', () => {
  it('renders a bespoke DCL error page, not a generic technical error screen', () => {
    render(<NotFound />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
    expect(screen.getByTestId('text-not-found-label')).toHaveTextContent('Page Not Found');
    const title = document.getElementById('not-found-title');
    expect(title?.textContent).toMatch(/the path changed/i);
    expect(title?.textContent).toMatch(/the perspective remains/i);
    expect(screen.getByTestId('text-not-found-body')).toHaveTextContent(/may have moved, changed or no longer be available/i);
  });

  it('renders working recovery CTAs to real routes', () => {
    render(<NotFound />);
    expect(screen.getByTestId('link-not-found-primary')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('link-not-found-secondary')).toHaveAttribute('href', '/services');
    expect(screen.getByTestId('link-not-found-tertiary')).toHaveAttribute('href', '/contact');
  });

  it('renders the three quick-navigation links with no cards', () => {
    render(<NotFound />);
    for (const link of notFoundContent.quickLinks) {
      const el = screen.getByTestId(`link-not-found-quick-${link.label.toLowerCase()}`);
      expect(el).toHaveAttribute('href', link.href);
    }
  });

  it('does not render a dominant giant "404" numeral as the main visual (only a faint decorative watermark)', () => {
    render(<NotFound />);
    const heading = document.getElementById('not-found-title');
    expect(heading?.textContent).not.toMatch(/^404/);
    const watermark = screen.getByText('404');
    expect(watermark).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the global footer and the closing tagline', () => {
    render(<NotFound />);
    expect(document.querySelector('footer')).toBeInTheDocument();
    expect(screen.getByTestId('text-not-found-closing')).toHaveTextContent('Clarity Before Capital.');
  });

  it('contains no em-dash characters', () => {
    render(<NotFound />);
    const section = document.getElementById('not-found-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
