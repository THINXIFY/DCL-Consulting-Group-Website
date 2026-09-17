import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GetInTouchBand } from './GetInTouchBand';

describe('GetInTouchBand', () => {
  it('renders the eyebrow, headline, body, and CTA', () => {
    render(<GetInTouchBand />);
    expect(screen.getByTestId('text-get-in-touch-eyebrow')).toHaveTextContent('Get in Touch');
    expect(screen.getByTestId('text-get-in-touch-headline')).toHaveTextContent('Let');
    expect(screen.getByTestId('text-get-in-touch-body')).toHaveTextContent('Whether you are evaluating');
    expect(screen.getByTestId('link-get-in-touch-cta')).toHaveAttribute('href', '#how-can-we-help');
  });

  it('shows only the verified Registered Office detail, no invented email/phone/hours', () => {
    render(<GetInTouchBand />);
    expect(screen.getByTestId('get-in-touch-fact-registered-office')).toHaveTextContent('Tallow Wharf');
    expect(screen.queryByTestId('get-in-touch-fact-email')).not.toBeInTheDocument();
    expect(screen.queryByTestId('get-in-touch-fact-phone')).not.toBeInTheDocument();

    const section = document.getElementById('get-in-touch');
    const text = section?.textContent?.toLowerCase() ?? '';
    for (const forbidden of ['email', 'phone', 'office hours', 'whatsapp', 'fax']) {
      expect(text).not.toContain(forbidden);
    }
  });

  it('uses semantic address markup for the registered office', () => {
    render(<GetInTouchBand />);
    const fact = screen.getByTestId('get-in-touch-fact-registered-office');
    expect(fact.querySelector('address')).not.toBeNull();
  });

  it('renders the section visual with a real src and an honest alt that does not claim it is the registered office', () => {
    render(<GetInTouchBand />);
    const image = screen.getByTestId('img-get-in-touch-location');
    expect(image).toHaveAttribute('src', expect.stringContaining('cntct.webp'));
    const alt = (image.getAttribute('alt') ?? '').toLowerCase();
    expect(alt).not.toContain('our office');
    expect(alt).not.toContain('hertford');
    expect(alt).not.toContain('registered office');
  });

  it('presents People, Perspective, and Progress as restrained supporting micro-copy', () => {
    render(<GetInTouchBand />);
    const statement = screen.getByTestId('text-get-in-touch-statement');
    expect(statement).toHaveTextContent('People');
    expect(statement).toHaveTextContent('Perspective');
    expect(statement).toHaveTextContent('Progress');
  });

  it('contains no numbering or em-dash characters', () => {
    render(<GetInTouchBand />);
    const section = document.getElementById('get-in-touch');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
