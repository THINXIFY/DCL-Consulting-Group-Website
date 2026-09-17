import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { industries, industriesSection } from '@/data/home-content';
import { Industries } from './Industries';

function slug(name: string) {
  return name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

describe('Industries', () => {
  it('renders the eyebrow and the updated heading', () => {
    render(<Industries />);
    expect(screen.getByTestId('text-industries-eyebrow')).toHaveTextContent('Industries');
    const section = document.getElementById('industries');
    expect(section?.textContent).toMatch(/insight across/i);
    expect(section?.textContent).toMatch(/every sector/i);
  });

  it('links to the full Industries page', () => {
    render(<Industries />);
    const link = screen.getByTestId('link-industries-view-all');
    expect(link).toHaveTextContent('View All Industries');
    expect(link).toHaveAttribute('href', '/industries');
  });

  it('renders all six industries as real cards linking to /industries, with no numbering', () => {
    render(<Industries />);
    for (const item of industries) {
      const card = screen.getByTestId(`card-industry-${slug(item.name)}`);
      expect(card).toHaveAttribute('href', '/industries');
      expect(card).toHaveTextContent(item.name);
      expect(card).toHaveTextContent(item.context);
    }
    expect(screen.queryByText(/^0?[1-9][/.)-]/)).not.toBeInTheDocument();
  });

  it('renders the featured Real Estate card with an image and an Explore Sector CTA', () => {
    render(<Industries />);
    const card = screen.getByTestId('card-industry-real-estate-property');
    expect(card).toHaveTextContent('Explore Sector');
    expect(card.querySelector('img')).toHaveAttribute('src', industries[0].image.src);
  });

  it('renders real images for the three image-led cards and icons for the three text-led cards', () => {
    render(<Industries />);
    const imageCards = ['real-estate-property', 'energy-infrastructure', 'industrial-manufacturing'];
    const iconCards = ['technology-ai', 'healthcare-life-sciences', 'financial-services'];
    for (const testId of imageCards) {
      expect(screen.getByTestId(`card-industry-${testId}`).querySelector('img')).not.toBeNull();
    }
    for (const testId of iconCards) {
      expect(screen.getByTestId(`card-industry-${testId}`).querySelector('img')).toBeNull();
      expect(screen.getByTestId(`card-industry-${testId}`).querySelector('svg')).not.toBeNull();
    }
  });

  it('renders the editorial micro-text lines', () => {
    render(<Industries />);
    const section = document.getElementById('industries');
    for (const line of industriesSection.microLines) {
      expect(section?.textContent).toContain(line);
    }
  });

  it('contains no em-dash characters', () => {
    render(<Industries />);
    const section = document.getElementById('industries');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
