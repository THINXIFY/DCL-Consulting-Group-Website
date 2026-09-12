import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Faq } from './Faq';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('Faq', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, intro, start-a-conversation link, and all eight questions', () => {
    mockDesktop(true);
    render(<Faq />);
    expect(screen.getByTestId('text-faq-eyebrow')).toHaveTextContent('FAQ');
    expect(screen.getByText(/questions,/i)).toBeInTheDocument();
    expect(screen.getByText(/answered clearly/i)).toBeInTheDocument();
    expect(screen.getByText(/still have a question/i)).toBeInTheDocument();

    const link = screen.getByTestId('link-faq-start-conversation');
    expect(link).toHaveTextContent('Start a Conversation');
    expect(link).toHaveAttribute('href', '#about');

    expect(screen.getAllByRole('button', { name: /./ })).toHaveLength(8);
  });

  it('opens the first question by default and allows only one open at a time', () => {
    mockDesktop(true);
    render(<Faq />);
    const first = screen.getByTestId('faq-button-what-does-dcl-consulting-do');
    const second = screen.getByTestId('faq-button-who-does-dcl-work-with');
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(second).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'true');
    expect(first).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the open question when clicked again', () => {
    mockDesktop(true);
    render(<Faq />);
    const first = screen.getByTestId('faq-button-what-does-dcl-consulting-do');
    expect(first).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'false');
  });

  it('wires aria-controls to a real panel element for each question', () => {
    mockDesktop(true);
    render(<Faq />);
    const button = screen.getByTestId('faq-button-what-does-dcl-consulting-do');
    const panelId = button.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId as string)).not.toBeNull();
  });

  it('works the same way on mobile (no hover dependency)', () => {
    mockDesktop(false);
    render(<Faq />);
    const first = screen.getByTestId('faq-button-what-does-dcl-consulting-do');
    expect(first).toHaveAttribute('aria-expanded', 'true');
    const second = screen.getByTestId('faq-button-who-does-dcl-work-with');
    fireEvent.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'true');
  });
});
