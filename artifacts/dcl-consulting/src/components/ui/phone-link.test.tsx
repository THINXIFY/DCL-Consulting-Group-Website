import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PhoneLink } from './phone-link';

describe('PhoneLink', () => {
  it('displays the UK number but dials the real operational line', () => {
    render(<PhoneLink />);
    const link = screen.getByTestId('link-phone');
    expect(link).toHaveTextContent('+44 20 7946 0958');
    expect(link).toHaveAttribute('href', 'tel:+38653839596');
  });

  it('discloses the routing via the accessible label and a hover tooltip, without a permanent visible caption', () => {
    render(<PhoneLink />);
    const link = screen.getByTestId('link-phone');
    expect(link).toHaveAttribute('aria-label', 'Call DCL at +44 20 7946 0958. Calls are routed to our operational line.');
    expect(link).toHaveAttribute('title', 'Calls are routed to our operational line.');
  });

  it('accepts a distinct testid so multiple instances on one page (e.g. footer + contact page) never collide', () => {
    render(<PhoneLink testId="link-footer-phone" />);
    expect(screen.getByTestId('link-footer-phone')).toBeInTheDocument();
  });
});
