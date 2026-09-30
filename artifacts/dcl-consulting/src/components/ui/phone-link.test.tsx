import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PhoneLink } from './phone-link';

describe('PhoneLink', () => {
  it('displays and dials the same real number', () => {
    render(<PhoneLink />);
    const link = screen.getByTestId('link-phone');
    expect(link).toHaveTextContent('+44 20 7946 0958');
    expect(link).toHaveAttribute('href', 'tel:+442079460958');
  });

  it('has an accessible label naming the number', () => {
    render(<PhoneLink />);
    const link = screen.getByTestId('link-phone');
    expect(link).toHaveAttribute('aria-label', 'Call DCL at +44 20 7946 0958');
  });

  it('accepts a distinct testid so multiple instances on one page (e.g. footer + contact page) never collide', () => {
    render(<PhoneLink testId="link-footer-phone" />);
    expect(screen.getByTestId('link-footer-phone')).toBeInTheDocument();
  });
});
