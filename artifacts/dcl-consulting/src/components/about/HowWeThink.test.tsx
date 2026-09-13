import { fireEvent, render, screen } from '@testing-library/react';
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

  it('renders the eyebrow, headline, intro, and the closing statement', () => {
    mockDesktop(true);
    render(<HowWeThink />);
    expect(screen.getByTestId('text-think-eyebrow')).toHaveTextContent('How we think');
    expect(screen.getByText(/better decisions begin/i)).toBeInTheDocument();
    expect(screen.getByText(/before forming a view/i)).toBeInTheDocument();
    expect(screen.getByTestId('text-think-closing')).toHaveTextContent('Information creates value when it leads to clearer judgement.');
  });

  it('shows four decision planes and marks Context active by default on desktop', () => {
    mockDesktop(true);
    render(<HowWeThink />);
    const planes = screen.getAllByTestId(/^think-plane-/);
    expect(planes).toHaveLength(4);
    expect(screen.getByTestId('think-plane-0')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('text-think-active-label')).toHaveTextContent('Context');
    expect(screen.getByTestId('text-think-active-question')).toHaveTextContent('What are we actually considering?');
  });

  it('shows every chapter fully self-contained (label, question, copy) on mobile, no sticky/scroll dependency', () => {
    mockDesktop(false);
    render(<HowWeThink />);
    for (const [key, question] of [
      ['context', 'What are we actually considering?'],
      ['fundamentals', 'What is creating the underlying value?'],
      ['risk', 'What could materially change the outcome?'],
      ['judgement', 'What matters most from here?'],
    ]) {
      const chapter = screen.getByTestId(`think-mobile-${key}`);
      expect(chapter).toHaveTextContent(question);
    }
  });

  it('lets a visitor jump chapters via the progress dots', () => {
    mockDesktop(true);
    render(<HowWeThink />);
    const dots = screen.getAllByTestId(/^think-dot-/);
    expect(dots).toHaveLength(4);
    expect(dots[0]).toHaveAttribute('aria-current', 'true');
    fireEvent.click(screen.getByTestId('think-dot-2'));
    expect(screen.getByTestId('think-dot-2')).toHaveAttribute('aria-label', 'Go to Risk');
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<HowWeThink />);
    const section = document.getElementById('how-we-think');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
