import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EvaluationProcess } from './EvaluationProcess';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const STAGES = ['understand', 'analyse', 'challenge', 'assess', 'advise'];

describe('EvaluationProcess', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the headline, intro, and the closing statement', () => {
    mockDesktop(true);
    render(<EvaluationProcess />);
    expect(screen.getByText(/a disciplined path/i)).toBeInTheDocument();
    expect(screen.getByText(/five connected stages/i)).toBeInTheDocument();
    const closing = screen.getByTestId('text-evaluation-closing');
    expect(closing).toHaveTextContent('The process is structured.');
    expect(closing).toHaveTextContent('The judgement remains considered.');
  });

  it('shows five layers and markers on desktop, with Understand active by default', () => {
    mockDesktop(true);
    render(<EvaluationProcess />);
    for (const stage of STAGES) {
      expect(screen.getByTestId(`evaluation-layer-${stage}`)).toBeInTheDocument();
      expect(screen.getByTestId(`evaluation-marker-${stage}`)).toBeInTheDocument();
    }
    expect(screen.getByTestId('evaluation-marker-understand')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('evaluation-active-name')).toHaveTextContent('Understand');
    expect(screen.getByTestId('evaluation-active-statement')).toHaveTextContent('Start with the decision itself.');
  });

  it('shows every stage fully self-contained on mobile, no sticky/scroll dependency', () => {
    mockDesktop(false);
    render(<EvaluationProcess />);
    for (const [stage, statement] of [
      ['understand', 'Start with the decision itself.'],
      ['analyse', 'Look beneath the surface of the opportunity.'],
      ['challenge', 'Test what the opportunity depends upon.'],
      ['assess', 'Weigh what matters against what remains uncertain.'],
      ['advise', 'Turn analysis into a clear point of view.'],
    ]) {
      expect(screen.getByTestId(`evaluation-mobile-${stage}`)).toHaveTextContent(statement);
    }
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<EvaluationProcess />);
    const section = document.getElementById('evaluation-process');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
