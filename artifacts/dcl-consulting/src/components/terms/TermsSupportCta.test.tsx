import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TermsSupportCta } from './TermsSupportCta';

describe('TermsSupportCta', () => {
  it('renders the eyebrow, headline, copy, and CTA linking to the real /contact route', () => {
    render(<TermsSupportCta />);
    expect(screen.getByTestId('text-terms-support-title')).toHaveTextContent(/we.?re here to help/i);
    const cta = screen.getByTestId('link-terms-support-cta');
    expect(cta).toHaveAttribute('href', '/contact');
  });
});
