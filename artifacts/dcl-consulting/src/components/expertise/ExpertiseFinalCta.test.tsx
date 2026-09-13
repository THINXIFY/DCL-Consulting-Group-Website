import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ExpertiseFinalCta } from './ExpertiseFinalCta';

describe('ExpertiseFinalCta', () => {
  it('renders the headline, supporting copy, both CTAs, and the closing line', () => {
    render(<ExpertiseFinalCta />);
    expect(screen.getByTestId('text-expertise-final-title')).toHaveTextContent('A clearer view');
    expect(screen.getByTestId('text-expertise-final-title')).toHaveTextContent('before the next decision.');
    expect(screen.getByTestId('text-expertise-final-supporting')).toHaveTextContent(/independent perspective may add value/i);

    const primary = screen.getByTestId('link-expertise-final-primary');
    expect(primary).toHaveTextContent('Start a Conversation');
    expect(primary).toHaveAttribute('href', '/#about');

    const secondary = screen.getByTestId('link-expertise-final-secondary');
    expect(secondary).toHaveTextContent('Contact DCL');
    expect(secondary).toHaveAttribute('href', '/#about');

    expect(screen.getByTestId('text-expertise-final-closing')).toHaveTextContent('Clarity Before Capital.');
  });

  it('gives the primary CTA an explicit dark text color regardless of inherited styles', () => {
    render(<ExpertiseFinalCta />);
    expect(screen.getByTestId('link-expertise-final-primary').className).toContain('text-[#080a0d]');
  });

  it('contains no em-dash characters', () => {
    render(<ExpertiseFinalCta />);
    const section = document.getElementById('expertise-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
