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

  it('renders the eyebrow, headline, intro, and closing thought', () => {
    mockDesktop(true);
    render(<HowWeThink />);
    expect(screen.getByTestId('text-think-eyebrow')).toHaveTextContent('How we think');
    expect(screen.getByText(/better decisions begin/i)).toBeInTheDocument();
    expect(screen.getByText(/information creates value when it leads to clearer judgement/i)).toBeInTheDocument();
  });

  it('shows the first chapter\'s label and question in the sticky stage, with a reading column of copy only (no repeated titles)', () => {
    mockDesktop(true);
    render(<HowWeThink />);
    expect(screen.getByTestId('text-think-active-label')).toHaveTextContent('Context');
    expect(screen.getByTestId('text-think-active-question')).toHaveTextContent('What are we actually considering?');

    const readingRows = screen.getAllByTestId(/^think-reading-/);
    expect(readingRows).toHaveLength(4);
    expect(readingRows[0]).toHaveTextContent('Understand the opportunity');
    expect(readingRows[0]).not.toHaveTextContent('Context');
    expect(readingRows[0]).toHaveAttribute('data-active', 'true');
    expect(readingRows[1]).toHaveAttribute('data-active', 'false');
  });

  it('shows every chapter fully self-contained (label, question, copy) on mobile, no sticky/scroll dependency', () => {
    mockDesktop(false);
    render(<HowWeThink />);
    for (const title of ['Context', 'Fundamentals', 'Risk', 'Judgement']) {
      expect(screen.getByTestId(`think-mobile-${title.toLowerCase()}`)).toBeInTheDocument();
    }
    expect(screen.queryByTestId('text-think-active-label')).not.toBeInTheDocument();
  });
});
