import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { serviceDirectory } from '@/data/services-content';
import { Services } from './Services';

describe('Services', () => {
  it('renders the eyebrow, headline, and explore-all link', () => {
    render(<Services />);
    const section = document.getElementById('services');
    expect(section).not.toBeNull();
    expect(screen.getByTestId('text-services-eyebrow')).toHaveTextContent('Our services');
    const link = screen.getByTestId('link-services-explore-all');
    expect(link).toHaveAttribute('href', '/services');
  });

  it('renders all four service families with their services, matching the shared services directory', () => {
    render(<Services />);
    for (const family of serviceDirectory.families) {
      expect(screen.getByText(family.heading)).toBeInTheDocument();
      for (const service of family.services) {
        const link = screen.getByTestId(
          `link-service-${service.label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
        );
        expect(link).toHaveAttribute('href', service.href);
      }
    }
  });

  it('renders no images (typographic section)', () => {
    render(<Services />);
    const section = document.getElementById('services');
    expect(section?.querySelectorAll('img')).toHaveLength(0);
  });

  it('contains no em-dash characters', () => {
    render(<Services />);
    const section = document.getElementById('services');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
