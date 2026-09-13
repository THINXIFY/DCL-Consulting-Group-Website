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

  it('renders the headline, intro, and all six service index rows on desktop', () => {
    mockDesktop(true);
    render(<CoreExpertise />);
    expect(screen.getByText(/focused expertise/i)).toBeInTheDocument();
    for (const title of TITLES) {
      expect(screen.getByTestId(`expertise-index-${title.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-')}`)).toHaveTextContent(title);
    }
  });

  it('shows Investment Consulting active on the stage by default, and previews on hover', () => {
    mockDesktop(true);
    render(<CoreExpertise />);
    expect(screen.getByTestId('expertise-stage-title')).toHaveTextContent('Investment Consulting');

    fireEvent.mouseEnter(screen.getByTestId('expertise-index-opportunity-analysis'));
    expect(screen.getByTestId('expertise-stage-title')).toHaveTextContent('Opportunity Analysis');
    expect(screen.getByTestId('expertise-stage-description')).toHaveTextContent(/underlying proposition/i);

    fireEvent.mouseLeave(screen.getByTestId('expertise-index-opportunity-analysis'));
    expect(screen.getByTestId('expertise-stage-title')).toHaveTextContent('Investment Consulting');
  });

  it('previews on keyboard focus, matching hover behaviour', () => {
    mockDesktop(true);
    render(<CoreExpertise />);
    fireEvent.focus(screen.getByTestId('expertise-index-strategic-advisory'));
    expect(screen.getByTestId('expertise-stage-title')).toHaveTextContent('Strategic Advisory');
    fireEvent.blur(screen.getByTestId('expertise-index-strategic-advisory'));
    expect(screen.getByTestId('expertise-stage-title')).toHaveTextContent('Investment Consulting');
  });

  it('renders a vertical accordion on mobile, with descriptions revealed only on tap', () => {
    mockDesktop(false);
    render(<CoreExpertise />);
    const button = screen.getByRole('button', { name: /investment consulting/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(/independent perspective throughout the investment decision/i)).toBeInTheDocument();

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
