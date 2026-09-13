import { fireEvent, render, screen } from '@testing-library/react';
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

  it('renders the eyebrow, headline, intro, and the closing statement', () => {
    mockDesktop(true);
    render(<EvaluationProcess />);
    expect(screen.getByText(/our evaluation process/i)).toBeInTheDocument();
    expect(screen.getByText(/a disciplined path/i)).toBeInTheDocument();
    expect(screen.getByText(/moving through connected stages/i)).toBeInTheDocument();
    const closing = screen.getByTestId('text-evaluation-closing');
    expect(closing).toHaveTextContent('The process is structured.');
    expect(closing).toHaveTextContent('The judgement remains considered.');
  });

  it('shows five architectural bands and vertical stage navigation on desktop, with Understand active by default', () => {
    mockDesktop(true);
    render(<EvaluationProcess />);
    for (const stage of STAGES) {
      expect(screen.getByTestId(`evaluation-band-${stage}`)).toBeInTheDocument();
      expect(screen.getByTestId(`evaluation-nav-${stage}`)).toBeInTheDocument();
    }
    expect(screen.getByTestId('evaluation-nav-understand')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('evaluation-active-name')).toHaveTextContent('Understand');
    expect(screen.getByTestId('evaluation-active-statement')).toHaveTextContent('Start with the decision itself.');
  });

  it('jumps to a stage when its side navigation label is clicked', () => {
    mockDesktop(true);
    render(<EvaluationProcess />);
    expect(() => fireEvent.click(screen.getByTestId('evaluation-nav-challenge'))).not.toThrow();
  });

  it('shows every stage fully self-contained on mobile with the new presentation statements, no sticky/scroll dependency', () => {
    mockDesktop(false);
    render(<EvaluationProcess />);
    for (const [stage, statement] of [
      ['understand', 'Start with the decision itself.'],
      ['analyse', 'Examine what actually drives the opportunity.'],
      ['challenge', 'Test what must be true.'],
      ['assess', 'Separate what matters from what does not.'],
      ['advise', 'Turn analysis into a clearer decision.'],
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
