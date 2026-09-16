import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HowWeWork } from './HowWeWork';
import { howWeWork } from '@/data/services-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(name: string) {
  return name.toLowerCase().replaceAll(' ', '-');
}

describe('HowWeWork', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, supporting copy, all four stages, and the statement', () => {
    mockDesktop(true);
    render(<HowWeWork />);
    expect(screen.getByText(howWeWork.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('How we support');
    expect(screen.getByText(howWeWork.supporting)).toBeInTheDocument();
    for (const stage of howWeWork.stages) {
      const el = screen.getByTestId(`how-we-work-stage-${slug(stage.name)}`);
      expect(el).toHaveTextContent(stage.name);
      expect(el).toHaveTextContent(stage.description);
    }
    const section = document.getElementById('how-we-work');
    for (const line of howWeWork.statementLines) {
      expect(section?.textContent).toContain(line);
    }
  });

  it('activates the first stage by default on desktop, and previews a different one on hover', () => {
    mockDesktop(true);
    render(<HowWeWork />);
    const first = screen.getByTestId(`how-we-work-stage-${slug(howWeWork.stages[0]!.name)}`);
    const third = screen.getByTestId(`how-we-work-stage-${slug(howWeWork.stages[2]!.name)}`);
    expect(first).toHaveAttribute('data-active', 'true');
    expect(third).toHaveAttribute('data-active', 'false');

    fireEvent.mouseEnter(third);
    expect(third).toHaveAttribute('data-active', 'true');

    fireEvent.mouseLeave(third);
    expect(first).toHaveAttribute('data-active', 'true');
  });

  it('treats every stage as visually active on mobile', () => {
    mockDesktop(false);
    render(<HowWeWork />);
    for (const stage of howWeWork.stages) {
      expect(screen.getByTestId(`how-we-work-stage-${slug(stage.name)}`)).toHaveAttribute('data-active', 'true');
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<HowWeWork />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<HowWeWork />);
    const section = document.getElementById('how-we-work');
    expect(section?.textContent).not.toMatch(/[–—]/);
    expect(section?.textContent).not.toMatch(/(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i);
  });
});
