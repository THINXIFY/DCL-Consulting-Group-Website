import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { servicesSection } from '@/data/home-content';
import { serviceDirectory } from '@/data/services-content';
import { Services } from './Services';

function slug(text: string) {
  return text.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

describe('Services', () => {
  it('renders the eyebrow, headline, and explore-all link routing to /services', () => {
    render(<Services />);
    const section = document.getElementById('services');
    expect(section).not.toBeNull();
    expect(screen.getByTestId('text-services-eyebrow')).toHaveTextContent('Our Services');
    expect(screen.getByTestId('text-services-title')).toHaveTextContent(/expertise for.*what's next/i);
    const link = screen.getByTestId('link-services-explore-all');
    expect(link).toHaveAttribute('href', '/services');
    expect(link).toHaveTextContent('Explore All Services');
  });

  it('renders all four service families from the shared services directory, matching the real content exactly', () => {
    render(<Services />);
    for (const family of serviceDirectory.families) {
      const col = screen.getByTestId(`services-family-${slug(family.heading)}`);
      expect(col).toHaveTextContent(family.heading);
      expect(col).toHaveTextContent(family.line);
      for (const service of family.services) {
        const link = screen.getByTestId(`link-service-${slug(service.label)}`);
        expect(link).toHaveAttribute('href', service.href);
        expect(link).toHaveTextContent(service.label);
      }
    }
  });

  it('renders a decorative placeholder icon for each family (no real per-family imagery)', () => {
    render(<Services />);
    const icons = document.querySelectorAll('.service-icon img');
    expect(icons).toHaveLength(serviceDirectory.families.length);
    for (const icon of Array.from(icons)) {
      expect(icon).toHaveAttribute('alt', '');
    }
  });

  it('renders the editorial micro-text details', () => {
    render(<Services />);
    const section = document.getElementById('services');
    expect(section?.textContent).toContain(servicesSection.microLabel);
    for (const line of servicesSection.sideMicroLines) {
      expect(section?.textContent).toContain(line);
    }
    expect(section?.textContent).toContain(servicesSection.bottomMicroLines[0]);
  });

  it('contains no decorative numbering or em-dash characters', () => {
    render(<Services />);
    const section = document.getElementById('services');
    expect(section?.textContent).not.toMatch(/[–—]/);
    expect(section?.textContent).not.toMatch(/\b0?[1-4][/.)-]/);
  });
});
