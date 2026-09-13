import { render, screen } from '@testing-library/react';
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

  it('renders the headline, intro, all four perspective rows, and the closing statement', () => {
    mockDesktop(true);
    render(<HowWeAddPerspective />);
    expect(screen.getByText(/a broader view/i)).toBeInTheDocument();
    expect(screen.getByText(/a strong decision rarely depends on a single factor/i)).toBeInTheDocument();
    for (const category of ['commercial', 'financial', 'risk', 'strategic']) {
      expect(screen.getByTestId(`perspective-row-${category}`)).toBeInTheDocument();
    }
    const closing = screen.getByTestId('text-perspective-closing');
    expect(closing).toHaveTextContent('Perspective becomes valuable');
    expect(closing).toHaveTextContent('when it changes how the decision is understood.');
  });

  it('marks Commercial active by default on desktop', () => {
    mockDesktop(true);
    render(<HowWeAddPerspective />);
    expect(screen.getByTestId('perspective-row-commercial')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('perspective-row-financial')).toHaveAttribute('data-active', 'false');
  });

  it('shows every perspective fully expanded on mobile with no scroll dependency', () => {
    mockDesktop(false);
    render(<HowWeAddPerspective />);
    for (const category of ['commercial', 'financial', 'risk', 'strategic']) {
      expect(screen.getByTestId(`perspective-row-${category}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('contains no em-dash characters', () => {
    mockDesktop(true);
    render(<HowWeAddPerspective />);
    const section = document.getElementById('how-we-add-perspective');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
