import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhereExpertiseApplies } from './WhereExpertiseApplies';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const TITLES = [
  'Investment Opportunities',
  'Acquisitions',
  'Growth & Expansion',
  'Strategic Partnerships',
  'Business Assessment',
  'Complex Strategic Decisions',
];

describe('WhereExpertiseApplies', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, intro, all six decision contexts, the image, and the closing statement', () => {
    mockDesktop(true);
    render(<WhereExpertiseApplies />);
    expect(screen.getByTestId('text-applies-eyebrow')).toHaveTextContent('Where it applies');
    expect(screen.getByText(/where perspective/i)).toBeInTheDocument();
    expect(screen.getByText(/dcl's expertise can be applied across a range/i)).toBeInTheDocument();
    for (const title of TITLES) {
      expect(screen.getByTestId(`context-row-${title.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-')}`)).toHaveTextContent(title);
    }
    expect(screen.getByTestId('img-applies')).toBeInTheDocument();
    const closing = screen.getByTestId('text-applies-closing');
    expect(closing).toHaveTextContent('Different situations.');
    expect(closing).toHaveTextContent('The same need for clarity.');
  });

  it('uses the exact placeholder image URL', () => {
    mockDesktop(true);
    render(<WhereExpertiseApplies />);
    expect(screen.getByTestId('img-applies')).toHaveAttribute('src', 'https://media.ourwebprojects.pro/wp-content/uploads/2026/09/approach-img.webp');
  });

  it('activates Investment Opportunities by default, and previews a different context on hover', () => {
    mockDesktop(true);
    render(<WhereExpertiseApplies />);
    expect(screen.getByTestId('context-row-investment-opportunities')).toHaveAttribute('data-active', 'true');

    fireEvent.mouseEnter(screen.getByTestId('context-row-strategic-partnerships'));
    expect(screen.getByTestId('context-row-strategic-partnerships')).toHaveAttribute('data-active', 'true');
    expect(screen.getByText(/examine the strategic fit, commercial logic/i)).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByTestId('context-row-strategic-partnerships'));
    expect(screen.getByTestId('context-row-investment-opportunities')).toHaveAttribute('data-active', 'true');
  });

  it('keeps every description accessible without hover on mobile', () => {
    mockDesktop(false);
    render(<WhereExpertiseApplies />);
    for (const title of TITLES) {
      expect(screen.getByTestId(`context-row-${title.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-')}`)).toHaveAttribute('data-active', 'true');
    }
    expect(screen.getByText(/bring independent perspective to decisions shaped by uncertainty/i)).toBeInTheDocument();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WhereExpertiseApplies />);
    const section = document.getElementById('where-expertise-applies');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
