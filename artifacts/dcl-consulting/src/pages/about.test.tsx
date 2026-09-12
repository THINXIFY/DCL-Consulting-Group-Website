import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AboutPage from './about';

describe('AboutPage', () => {
  it('renders the header and all five About sections in order, and no footer', () => {
    render(<AboutPage />);
    const ids = ['about-hero', 'who-we-are', 'how-we-think', 'what-defines-dcl', 'leadership'];
    const sections = ids.map((id) => document.getElementById(id));
    for (const section of sections) {
      expect(section).not.toBeNull();
    }

    for (let i = 0; i < sections.length - 1; i++) {
      const position = sections[i]!.compareDocumentPosition(sections[i + 1]!);
      expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }

    expect(screen.getByTestId('link-home')).toBeInTheDocument();
    expect(document.querySelector('footer')).toBeNull();
  });
});
