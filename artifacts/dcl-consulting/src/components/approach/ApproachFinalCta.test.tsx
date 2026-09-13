import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ApproachFinalCta } from './ApproachFinalCta';

describe('ApproachFinalCta', () => {
  it('renders the headline, supporting copy, both CTAs, and the closing line', () => {
    render(<ApproachFinalCta />);
    expect(screen.getByTestId('text-approach-final-title')).toHaveTextContent('Bring greater clarity');
    expect(screen.getByTestId('text-approach-final-title')).toHaveTextContent('to the next decision.');
    expect(screen.getByTestId('text-approach-final-supporting')).toHaveTextContent(/disciplined evaluation process/i);

    const primary = screen.getByTestId('link-approach-final-primary');
    expect(primary).toHaveTextContent('Start a Conversation');
    expect(primary).toHaveAttribute('href', '/#about');

    const secondary = screen.getByTestId('link-approach-final-secondary');
    expect(secondary).toHaveTextContent('Explore Our Expertise');
    expect(secondary).toHaveAttribute('href', '/expertise');

    expect(screen.getByTestId('text-approach-final-closing')).toHaveTextContent('Clarity Before Capital.');
  });

  it('gives the primary CTA an explicit dark text color regardless of inherited styles', () => {
    render(<ApproachFinalCta />);
    expect(screen.getByTestId('link-approach-final-primary').className).toContain('text-[#080a0d]');
  });

  it('contains no em-dash characters', () => {
    render(<ApproachFinalCta />);
    const section = document.getElementById('approach-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
