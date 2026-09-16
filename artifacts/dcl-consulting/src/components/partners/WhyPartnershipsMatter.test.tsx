import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { whyPartnershipsMatter } from '@/data/partners-content';
import { WhyPartnershipsMatter } from './WhyPartnershipsMatter';

describe('WhyPartnershipsMatter', () => {
  it('renders the eyebrow, headline, body, and all three principles with no cards', () => {
    render(<WhyPartnershipsMatter />);
    expect(screen.getByTestId('text-why-partners-eyebrow')).toHaveTextContent('Why Partnerships Matter');
    const section = document.getElementById('why-partnerships-matter');
    expect(section?.textContent).toMatch(/better outcomes can begin/i);
    for (const principle of whyPartnershipsMatter.principles) {
      const el = screen.getByTestId(`why-partners-principle-${principle.label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`);
      expect(el).toHaveTextContent(principle.label);
      expect(el).toHaveTextContent(principle.headline);
      expect(el).toHaveTextContent(principle.copy);
    }
    expect(section?.querySelectorAll('.rounded-lg, .rounded-xl, [class*="shadow"]').length).toBe(0);
  });

  it('contains no em-dash characters', () => {
    render(<WhyPartnershipsMatter />);
    const section = document.getElementById('why-partnerships-matter');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
