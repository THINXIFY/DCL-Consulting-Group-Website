import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Hero } from './Hero';

describe('Hero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders exactly one eyebrow, the two-line headline, and both CTAs', () => {
    render(<Hero />);
    const section = screen.getByRole('region', { name: /clarity/i });
    expect(section).toHaveAttribute('id', 'top');

    expect(screen.getByTestId('text-hero-eyebrow')).toBeInTheDocument();
    expect(screen.getByTestId('text-hero-title')).toHaveTextContent(/clarity/i);
    expect(screen.getByTestId('text-hero-title')).toHaveTextContent(/before capital/i);

    const primary = screen.getByTestId('link-start-conversation-hero');
    expect(primary).toHaveTextContent('Start a Conversation');
    expect(primary).toHaveAttribute('href', '/contact');

    const secondary = screen.getByTestId('link-explore-services-hero');
    expect(secondary).toHaveTextContent('Explore Our Services');
    expect(secondary).toHaveAttribute('href', '/services');
  });

  it('renders the micro-information strip with no numbering', () => {
    render(<Hero />);
    const strip = screen.getByTestId('text-hero-micro-info');
    expect(strip).toHaveTextContent('Independent Perspective');
    expect(strip).toHaveTextContent('Strategic Analysis');
    expect(strip).toHaveTextContent('Long-Term Thinking');
    expect(strip.textContent).not.toMatch(/\b0?[1-3]\b/);
  });

  it('has no more than four text elements in the hero stack (eyebrow, headline, subtext, CTAs)', () => {
    render(<Hero />);
    expect(screen.queryByTestId('text-hero-tagline-strip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('link-explore-about')).not.toBeInTheDocument();
    expect(screen.queryByTestId('link-explore-expertise')).not.toBeInTheDocument();
  });

  it('renders the background video as decorative, hidden from assistive tech, with no controls', () => {
    render(<Hero />);
    const video = screen.getByTestId('video-hero-background');
    expect(video).toHaveAttribute('aria-hidden', 'true');
    expect(video).toHaveAttribute('autoplay');
    expect((video as HTMLVideoElement).muted).toBe(true);
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('src', '/video/dcl-hero-background.mp4');
    expect(video).not.toHaveAttribute('controls');
    expect(video.parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(video.parentElement).toHaveClass('pointer-events-none');
  });

  it('does not autoplay the background video when reduced motion is preferred', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );
    render(<Hero />);
    expect(screen.getByTestId('video-hero-background')).not.toHaveAttribute('autoplay');
  });

  it('renders the atmospheric particle layer as decorative, but not under reduced motion', () => {
    const { container, unmount } = render(<Hero />);
    const particleLayer = container.querySelector('[aria-hidden="true"] .dclHeroLux__particle');
    expect(particleLayer).not.toBeNull();
    unmount();

    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );
    const { container: reducedContainer } = render(<Hero />);
    expect(reducedContainer.querySelector('.dclHeroLux__particle')).toBeNull();
  });

  it('contains no em-dash characters in visible copy', () => {
    render(<Hero />);
    const section = screen.getByRole('region', { name: /clarity/i });
    expect(section.textContent).not.toMatch(/[–—]/);
  });
});
