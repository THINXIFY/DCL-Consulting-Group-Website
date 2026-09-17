import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expertiseSection } from '@/data/home-content';
import { Expertise } from './Expertise';

function slug(label: string) {
  return label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

describe('Expertise', () => {
  it('renders the eyebrow, two-line headline, body, micro label, and primary CTA to /expertise', () => {
    render(<Expertise />);
    const section = document.getElementById('expertise');
    expect(section).not.toBeNull();
    expect(screen.getByTestId('text-expertise-eyebrow')).toHaveTextContent('Our Expertise');
    expect(screen.getByTestId('text-expertise-title')).toHaveTextContent(/expertise for.*what's next/i);
    expect(section?.textContent).toContain(expertiseSection.microLabel);

    const cta = screen.getByTestId('link-expertise-explore');
    expect(cta).toHaveTextContent('Explore All Expertise');
    expect(cta).toHaveAttribute('href', '/expertise');
  });

  it('renders all four expertise groups matching the real services taxonomy', () => {
    render(<Expertise />);
    for (const group of expertiseSection.groups) {
      const col = screen.getByTestId(`expertise-group-${slug(group.heading)}`);
      expect(col).toHaveTextContent(group.heading);
      expect(col).toHaveTextContent(group.copy);
    }
  });

  it('renders every capability as a real link to its actual /services route', () => {
    render(<Expertise />);
    for (const group of expertiseSection.groups) {
      for (const capability of group.capabilities) {
        const link = screen.getByTestId(`link-expertise-capability-${slug(capability.label)}`);
        expect(link).toHaveAttribute('href', capability.href);
        expect(link).toHaveTextContent(capability.label);
      }
    }
  });

  it('renders no decorative numbering anywhere in the section', () => {
    render(<Expertise />);
    const section = document.getElementById('expertise');
    expect(section?.textContent).not.toMatch(/\b0?[1-4][/.)-]/);
  });

  it('contains no em-dash characters', () => {
    render(<Expertise />);
    const section = document.getElementById('expertise');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
