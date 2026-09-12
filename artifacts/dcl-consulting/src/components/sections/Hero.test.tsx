import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders exactly one eyebrow, the two-line headline, and both CTAs', () => {
    render(<Hero />);
    const section = screen.getByRole('region', { name: /clarity/i });
    expect(section).toHaveAttribute('id', 'top');

    expect(screen.getByTestId('text-hero-eyebrow')).toBeInTheDocument();
    expect(screen.getByTestId('text-hero-title')).toHaveTextContent(/clarity/i);
    expect(screen.getByTestId('text-hero-title')).toHaveTextContent(/before capital/i);

    expect(screen.getByTestId('link-explore-expertise')).toHaveTextContent('Explore Our Expertise');
    expect(screen.getByTestId('link-start-conversation-hero')).toHaveTextContent('Start a Conversation');
  });

  it('has no more than four text elements in the hero stack (eyebrow, headline, subtext, CTAs)', () => {
    render(<Hero />);
    expect(screen.queryByTestId('text-hero-tagline-strip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('link-explore-about')).not.toBeInTheDocument();
  });

  it('contains no em-dash characters in visible copy', () => {
    render(<Hero />);
    const section = screen.getByRole('region', { name: /clarity/i });
    expect(section.textContent).not.toMatch(/[–—]/);
  });
});
