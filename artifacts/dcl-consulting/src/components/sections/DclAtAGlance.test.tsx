import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DclAtAGlance } from './DclAtAGlance';

describe('DclAtAGlance', () => {
  it('renders the eyebrow, headline, and the exact five company facts with no invented data', () => {
    render(<DclAtAGlance />);
    expect(screen.getByTestId('text-glance-eyebrow')).toHaveTextContent('DCL at a glance');
    expect(screen.getByText(/established structure/i)).toBeInTheDocument();

    const facts: Array<[string, string]> = [
      ['Company', 'DCL Consulting and Investments Limited'],
      ['Company Type', 'Private Limited Company'],
      ['Registered In', 'England & Wales'],
      ['Company Number', '10086906'],
      ['Director', 'David Christopher Lebond'],
    ];
    for (const [label, value] of facts) {
      const row = screen.getByTestId(`fact-${label.toLowerCase().replaceAll(' ', '-')}`);
      expect(row).toHaveTextContent(label);
      expect(row).toHaveTextContent(value);
    }
  });

  it('contains no numbering or em-dash characters', () => {
    render(<DclAtAGlance />);
    const section = document.getElementById('dcl-at-a-glance');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });

  it('gives each fact row its own animated rule, and hides the decorative watermark from assistive tech', () => {
    render(<DclAtAGlance />);
    const row = screen.getByTestId('fact-director');
    expect(row.querySelector('.dclGlance__rowRule')).not.toBeNull();

    const section = document.getElementById('dcl-at-a-glance');
    const watermark = section?.querySelector('[aria-hidden="true"]');
    expect(watermark).not.toBeNull();
    expect(watermark).toHaveTextContent('DCL');
  });
});
