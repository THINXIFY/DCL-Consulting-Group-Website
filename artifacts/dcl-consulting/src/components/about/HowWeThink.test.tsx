import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HowWeThink } from './HowWeThink';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('HowWeThink', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, intro, and all four chapter titles', () => {
    mockDesktop(true);
    render(<HowWeThink />);
    expect(screen.getByTestId('text-think-eyebrow')).toHaveTextContent('How we think');
    expect(screen.getByText(/better decisions begin/i)).toBeInTheDocument();
    for (const title of ['Context', 'Fundamentals', 'Risk', 'Judgement']) {
      expect(screen.getByTestId(`think-chapter-${title.toLowerCase()}`)).toHaveTextContent(title);
    }
    expect(screen.getByText(/information creates value when it leads to clearer judgement/i)).toBeInTheDocument();
  });

  it('shows the first chapter active by default on desktop, with its question in the sticky panel', () => {
    mockDesktop(true);
    render(<HowWeThink />);
    expect(screen.getByTestId('think-chapter-context')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('think-chapter-fundamentals')).toHaveAttribute('data-active', 'false');
    expect(screen.getByTestId('text-think-active-question')).toHaveTextContent('What are we actually considering?');
  });

  it('shows every chapter fully visible on mobile with no sticky/scroll dependency', () => {
    mockDesktop(false);
    render(<HowWeThink />);
    for (const title of ['Context', 'Fundamentals', 'Risk', 'Judgement']) {
      const chapter = screen.getByTestId(`think-chapter-${title.toLowerCase()}`);
      expect(chapter).toHaveAttribute('data-active', 'true');
    }
  });
});
