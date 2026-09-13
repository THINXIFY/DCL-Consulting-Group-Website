import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CoreExpertise } from './CoreExpertise';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const TITLES = [
  'Investment Consulting',
  'Opportunity Analysis',
  'Risk & Opportunity Assessment',
  'Business & Financial Analysis',
  'Strategic Advisory',
  'Due Diligence Support',
];

describe('CoreExpertise', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the headline, intro, all six service rows, and the closing statement', () => {
    mockDesktop(true);
    render(<CoreExpertise />);
    expect(screen.getByText(/focused expertise/i)).toBeInTheDocument();
    for (const title of TITLES) {
      expect(screen.getByTestId(`expertise-row-${title.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-')}`)).toHaveTextContent(title);
    }
    const closing = screen.getByTestId('text-expertise-closing');
    expect(closing).toHaveTextContent('Expertise is most valuable');
    expect(closing).toHaveTextContent('when it brings the decision into focus.');
  });

  it('expands Investment Consulting by default and reveals its description inline (no separate panel)', () => {
    mockDesktop(true);
    render(<CoreExpertise />);
    expect(screen.getByTestId('expertise-row-investment-consulting')).toHaveAttribute('data-active', 'true');
    expect(screen.getByText(/structured support for investors evaluating significant opportunities/i)).toBeInTheDocument();
  });

  it('expands a different row on hover, and collapses it back on mouse leave', () => {
    mockDesktop(true);
    render(<CoreExpertise />);
    fireEvent.mouseEnter(screen.getByTestId('expertise-row-strategic-advisory'));
    expect(screen.getByTestId('expertise-row-strategic-advisory')).toHaveAttribute('data-active', 'true');
    expect(screen.getByText(/strategic perspective for businesses and investors/i)).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByTestId('expertise-row-strategic-advisory'));
    expect(screen.getByTestId('expertise-row-investment-consulting')).toHaveAttribute('data-active', 'true');
  });

  it('expands on keyboard focus, matching hover behaviour', () => {
    mockDesktop(true);
    render(<CoreExpertise />);
    fireEvent.focus(screen.getByTestId('expertise-row-due-diligence-support'));
    expect(screen.getByTestId('expertise-row-due-diligence-support')).toHaveAttribute('data-active', 'true');
    fireEvent.blur(screen.getByTestId('expertise-row-due-diligence-support'));
    expect(screen.getByTestId('expertise-row-investment-consulting')).toHaveAttribute('data-active', 'true');
  });

  it('renders a vertical accordion on mobile, with descriptions revealed only on tap', () => {
    mockDesktop(false);
    render(<CoreExpertise />);
    const button = screen.getByRole('button', { name: /investment consulting/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/structured support for investors evaluating significant opportunities/i)).toBeInTheDocument();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<CoreExpertise />);
    const section = document.getElementById('core-expertise');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
