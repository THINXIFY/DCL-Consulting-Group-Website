import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CoreExpertise } from './CoreExpertise';
import { coreExpertise } from '@/data/expertise-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(title: string) {
  return title.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

describe('CoreExpertise', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, intro, image, and all six capability rows on desktop', () => {
    mockDesktop(true);
    render(<CoreExpertise />);
    expect(screen.getByText(coreExpertise.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Specialist expertise.');
    expect(screen.getByText(coreExpertise.intro)).toBeInTheDocument();
    expect(screen.getByTestId('img-core-expertise')).toBeInTheDocument();
    for (const capability of coreExpertise.capabilities) {
      expect(screen.getByTestId(`core-expertise-row-${slug(capability.title)}`)).toHaveTextContent(capability.title);
    }
  });

  it('shows the first capability active by default, with correct detail content and CTA route', () => {
    mockDesktop(true);
    render(<CoreExpertise />);
    const first = coreExpertise.capabilities[0]!;
    expect(screen.getByTestId(`core-expertise-row-${slug(first.title)}`)).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('text-core-expertise-headline')).toHaveTextContent(first.headline);
    expect(screen.getByTestId('text-core-expertise-copy')).toHaveTextContent(first.copy);
    const cta = screen.getByTestId('link-core-expertise-cta');
    expect(cta).toHaveTextContent(first.ctaLabel);
    expect(cta).toHaveAttribute('href', first.href);
  });

  it('activates a different capability on click, and it stays active after the pointer leaves', () => {
    mockDesktop(true);
    render(<CoreExpertise />);
    const third = coreExpertise.capabilities[2]!;
    const row = screen.getByTestId(`core-expertise-row-${slug(third.title)}`);

    fireEvent.click(row);
    expect(row).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('text-core-expertise-headline')).toHaveTextContent(third.headline);

    fireEvent.mouseLeave(row.parentElement!);
    expect(row).toHaveAttribute('data-active', 'true');
  });

  it('previews a different capability on hover without discarding the clicked selection', () => {
    mockDesktop(true);
    render(<CoreExpertise />);
    const second = coreExpertise.capabilities[1]!;
    const fourth = coreExpertise.capabilities[3]!;
    const secondRow = screen.getByTestId(`core-expertise-row-${slug(second.title)}`);
    const fourthRow = screen.getByTestId(`core-expertise-row-${slug(fourth.title)}`);

    fireEvent.click(secondRow);
    fireEvent.mouseEnter(fourthRow);
    expect(fourthRow).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('text-core-expertise-headline')).toHaveTextContent(fourth.headline);

    fireEvent.mouseLeave(fourthRow.parentElement!);
    expect(secondRow).toHaveAttribute('data-active', 'true');
  });

  it('uses correct real routes for capabilities with dedicated service pages, and /services for the rest', () => {
    mockDesktop(true);
    render(<CoreExpertise />);
    for (const capability of coreExpertise.capabilities) {
      fireEvent.click(screen.getByTestId(`core-expertise-row-${slug(capability.title)}`));
      expect(screen.getByTestId('link-core-expertise-cta')).toHaveAttribute('href', capability.href);
    }
  });

  it('renders an accessible accordion on mobile, with each panel exposing its own CTA', () => {
    mockDesktop(false);
    render(<CoreExpertise />);
    const first = coreExpertise.capabilities[0]!;
    const button = screen.getByRole('button', { name: new RegExp(first.title) });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const cta = screen.getByTestId(`core-expertise-accordion-cta-${slug(first.title)}`);
    expect(cta).toHaveAttribute('href', first.href);
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<CoreExpertise />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<CoreExpertise />);
    const section = document.getElementById('core-expertise');
    expect(section?.textContent).not.toMatch(/[–—]/);
    expect(section?.textContent).not.toMatch(/(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i);
  });
});
