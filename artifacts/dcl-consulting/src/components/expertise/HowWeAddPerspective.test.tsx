import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HowWeAddPerspective } from './HowWeAddPerspective';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('HowWeAddPerspective', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the headline, intro, and the closing statement', () => {
    mockDesktop(true);
    render(<HowWeAddPerspective />);
    expect(screen.getByText(/a broader view/i)).toBeInTheDocument();
    expect(screen.getByText(/a strong decision rarely depends on a single factor/i)).toBeInTheDocument();
    const closing = screen.getByTestId('text-perspective-closing');
    expect(closing).toHaveTextContent('Perspective becomes valuable');
    expect(closing).toHaveTextContent('when it changes how the decision is understood.');
  });

  it('shows all four perspective tabs on desktop, with Commercial active by default', () => {
    mockDesktop(true);
    render(<HowWeAddPerspective />);
    for (const category of ['commercial', 'financial', 'risk', 'strategic']) {
      expect(screen.getByTestId(`perspective-tab-${category}`)).toBeInTheDocument();
    }
    expect(screen.getByTestId('perspective-tab-commercial')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('perspective-stage-question')).toHaveTextContent('How does the opportunity work in practice?');
  });

  it('switches the stage content when a different tab is hovered, and reverts on mouse leave', () => {
    mockDesktop(true);
    render(<HowWeAddPerspective />);
    fireEvent.mouseEnter(screen.getByTestId('perspective-tab-risk'));
    expect(screen.getByTestId('perspective-stage-question')).toHaveTextContent('What could materially change the outcome?');
    expect(screen.getByTestId('perspective-stage-category')).toHaveTextContent('Risk');

    fireEvent.mouseLeave(screen.getByTestId('perspective-tab-risk').parentElement!);
    expect(screen.getByTestId('perspective-stage-question')).toHaveTextContent('How does the opportunity work in practice?');
  });

  it('switches the stage content on click', () => {
    mockDesktop(true);
    render(<HowWeAddPerspective />);
    fireEvent.click(screen.getByTestId('perspective-tab-strategic'));
    expect(screen.getByTestId('perspective-stage-question')).toHaveTextContent('How does it fit the wider objective?');
  });

  it('shows every perspective as a self-contained mobile chapter, no tab/scroll dependency', () => {
    mockDesktop(false);
    render(<HowWeAddPerspective />);
    for (const [category, question] of [
      ['commercial', 'How does the opportunity work in practice?'],
      ['financial', 'What do the economics indicate?'],
      ['risk', 'What could materially change the outcome?'],
      ['strategic', 'How does it fit the wider objective?'],
    ]) {
      expect(screen.getByTestId(`perspective-mobile-${category}`)).toHaveTextContent(question);
    }
  });

  it('contains no em-dash characters', () => {
    mockDesktop(true);
    render(<HowWeAddPerspective />);
    const section = document.getElementById('how-we-add-perspective');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
