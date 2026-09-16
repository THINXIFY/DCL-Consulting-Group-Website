import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PartnersFinalCta } from './PartnersFinalCta';

describe('PartnersFinalCta', () => {
  it('renders the eyebrow, headline, body, both CTAs, and closing line', () => {
    render(<PartnersFinalCta />);
    expect(screen.getByTestId('text-partners-final-small')).toHaveTextContent("Let's Work Together");
    const title = document.getElementById('partners-final-title');
    expect(title?.textContent).toMatch(/a stronger perspective/i);
    expect(screen.getByTestId('text-partners-final-body')).toHaveTextContent(/if you see an opportunity/i);

    const primary = screen.getByTestId('link-partners-final-primary');
    expect(primary).toHaveTextContent('Discuss a Partnership');
    expect(primary).toHaveAttribute('href', '/contact');
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-partners-final-secondary');
    expect(secondary).toHaveTextContent('Contact DCL');
    expect(secondary).toHaveAttribute('href', '/contact');

    expect(screen.getByTestId('text-partners-final-closing')).toHaveTextContent(/clarity through collaboration/i);
  });

  it('contains no em-dash characters', () => {
    render(<PartnersFinalCta />);
    const section = document.getElementById('partners-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
