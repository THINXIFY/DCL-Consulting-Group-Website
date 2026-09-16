import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { partnershipAreas } from '@/data/partners-content';
import { PartnershipAreas } from './PartnershipAreas';

describe('PartnershipAreas', () => {
  it('renders the eyebrow, headline, and all six areas with their copy, no cards', () => {
    render(<PartnershipAreas />);
    expect(screen.getByTestId('text-partnership-areas-eyebrow')).toHaveTextContent('Where We Collaborate');
    for (const area of partnershipAreas.areas) {
      const el = screen.getByTestId(`partnership-area-${area.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`);
      expect(el).toHaveTextContent(area.name);
      expect(el).toHaveTextContent(area.copy);
    }
  });

  it('contains no em-dash characters', () => {
    render(<PartnershipAreas />);
    const section = document.getElementById('partnership-areas');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
