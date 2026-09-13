import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChallengeAssumptions } from './ChallengeAssumptions';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const QUESTIONS = ['what-must-be-true', 'what-may-be-missing', 'what-could-change', 'what-deserves-more-attention'];

describe('ChallengeAssumptions', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the headline, intro, all four challenge questions, and the closing statement', () => {
    mockDesktop(true);
    render(<ChallengeAssumptions />);
    expect(screen.getByText(/good analysis should/i)).toBeInTheDocument();
    expect(screen.getByText(/an opportunity can appear compelling/i)).toBeInTheDocument();
    for (const id of QUESTIONS) {
      expect(screen.getByTestId(`challenge-item-${id}`)).toBeInTheDocument();
    }
    const closing = screen.getByTestId('text-challenge-closing');
    expect(closing).toHaveTextContent('Challenge is not about finding reasons to reject an opportunity.');
    expect(closing).toHaveTextContent('It is about understanding it more completely.');
  });

  it('activates the first question by default on desktop, and previews a different one on hover', () => {
    mockDesktop(true);
    render(<ChallengeAssumptions />);
    expect(screen.getByTestId('challenge-item-what-must-be-true')).toHaveAttribute('data-active', 'true');

    fireEvent.mouseEnter(screen.getByTestId('challenge-item-what-could-change'));
    expect(screen.getByTestId('challenge-item-what-could-change')).toHaveAttribute('data-active', 'true');
    expect(screen.getByText(/commercial, financial, market or strategic developments/i)).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByTestId('challenge-item-what-could-change'));
    expect(screen.getByTestId('challenge-item-what-must-be-true')).toHaveAttribute('data-active', 'true');
  });

  it('keeps every explanation accessible without hover on mobile', () => {
    mockDesktop(false);
    render(<ChallengeAssumptions />);
    for (const id of QUESTIONS) {
      expect(screen.getByTestId(`challenge-item-${id}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<ChallengeAssumptions />);
    const section = document.getElementById('challenge-assumptions');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
