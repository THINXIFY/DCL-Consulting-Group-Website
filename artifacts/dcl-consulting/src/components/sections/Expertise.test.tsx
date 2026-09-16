import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expertiseSection } from '@/data/home-content';
import { Expertise } from './Expertise';

describe('Expertise', () => {
  it('renders the eyebrow, two-line headline, body, and primary CTA', () => {
    render(<Expertise />);
    const section = document.getElementById('expertise');
    expect(section).not.toBeNull();
    expect(screen.getByTestId('text-expertise-eyebrow')).toHaveTextContent('Our Expertise');
    expect(section?.textContent).toMatch(/different expertise/i);
    expect(section?.textContent).toMatch(/a clearer view/i);

    const cta = screen.getByTestId('link-expertise-explore');
    expect(cta).toHaveTextContent('Explore Our Expertise');
    expect(cta).toHaveAttribute('href', '/expertise');
  });

  it('renders the real supporting image with the overlay statement', () => {
    render(<Expertise />);
    const img = document.querySelector('.dclExpertise__imageWrap img');
    expect(img).toHaveAttribute('src', expect.stringContaining('/images/home/'));
    expect(img).toHaveAttribute('alt', expect.stringMatching(/./));
    for (const line of expertiseSection.imageStatementLines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
  });

  it('renders all four expertise areas as real links, each with icon, label, headline, copy, and a learn-more link', () => {
    render(<Expertise />);
    for (const area of expertiseSection.areas) {
      const link = screen.getByTestId(`link-expertise-area-${area.label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`);
      expect(link).toHaveAttribute('href', area.href);
      expect(link).toHaveTextContent(area.label);
      expect(link).toHaveTextContent(area.headlineLines.join(''));
      expect(link).toHaveTextContent(area.copy);
      expect(link).toHaveTextContent('Learn more');
    }
  });

  it('renders no decorative numbering anywhere in the section', () => {
    render(<Expertise />);
    const section = document.getElementById('expertise');
    expect(section?.textContent).not.toMatch(/\b0[1-4]\b/);
  });

  it('renders the bottom editorial strip with eyebrow, statement, copy, and approach link', () => {
    render(<Expertise />);
    const section = document.getElementById('expertise');
    expect(section?.textContent).toMatch(/our approach in practice/i);
    expect(section?.textContent).toMatch(/expertise is most valuable/i);
    const link = screen.getByTestId('link-expertise-strip-approach');
    expect(link).toHaveAttribute('href', '/approach');
    expect(link).toHaveTextContent('Our Approach');
  });

  it('contains no em-dash characters', () => {
    render(<Expertise />);
    const section = document.getElementById('expertise');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
