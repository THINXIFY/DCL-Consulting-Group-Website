import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinalCta } from './FinalCta';

describe('FinalCta', () => {
  it('renders the headline, supporting copy, and both CTAs with the brief-specified priority', () => {
    render(<FinalCta />);
    const title = screen.getByTestId('text-final-title');
    expect(title).toHaveTextContent(/bring greater clarity/i);
    expect(title).toHaveTextContent(/to the next decision/i);
    expect(screen.getByText(/independent perspective\. structured analysis\. clearer decisions\./i)).toBeInTheDocument();

    const primary = screen.getByTestId('link-final-start-conversation');
    expect(primary).toHaveTextContent('Start a Conversation');
    expect(primary).toHaveAttribute('href', '#about');

    const secondary = screen.getByTestId('link-final-explore-expertise');
    expect(secondary).toHaveTextContent('Explore Our Expertise');
    expect(secondary).toHaveAttribute('href', '#expertise');
  });

  it('renders the decorative background image, hidden from assistive tech', () => {
    render(<FinalCta />);
    const img = screen.getByTestId('img-final-cta-background');
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveAttribute('src', expect.stringContaining('/images/home/'));
    expect(img.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('contains no em-dash characters', () => {
    render(<FinalCta />);
    const section = document.getElementById('final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
