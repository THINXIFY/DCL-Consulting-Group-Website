import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AnalysisToJudgement } from './AnalysisToJudgement';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const IDEAS = ['what-matters', 'what-remains-uncertain', 'what-follows'];

describe('AnalysisToJudgement', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the headline, intro, all three ideas, and the closing statement on desktop', () => {
    mockDesktop(true);
    render(<AnalysisToJudgement />);
    expect(screen.getByText(/analysis matters/i)).toBeInTheDocument();
    expect(screen.getByText(/the value of analysis lies in identifying/i)).toBeInTheDocument();
    for (const id of IDEAS) {
      expect(screen.getByTestId(`judgement-idea-${id}`)).toBeInTheDocument();
    }
    const closing = screen.getByTestId('text-judgement-closing');
    expect(closing).toHaveTextContent('More information does not always create more clarity.');
    expect(closing).toHaveTextContent('Better judgement does.');
  });

  it('uses only real terminology in the background, no invented statistics', () => {
    mockDesktop(true);
    render(<AnalysisToJudgement />);
    for (const term of ['Commercial', 'Financial', 'Assumptions', 'Risk', 'Evidence']) {
      expect(screen.getByText(term)).toBeInTheDocument();
    }
  });

  it('renders every idea and the closing statement on mobile with no scroll dependency', () => {
    mockDesktop(false);
    render(<AnalysisToJudgement />);
    for (const id of IDEAS) {
      expect(screen.getByTestId(`judgement-idea-${id}`)).toBeInTheDocument();
    }
    expect(screen.getByTestId('text-judgement-closing')).toHaveTextContent('Better judgement does.');
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<AnalysisToJudgement />);
    const section = document.getElementById('analysis-to-judgement');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
