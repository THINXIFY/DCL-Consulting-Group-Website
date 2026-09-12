import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AboutPage from './about';

describe('AboutPage', () => {
  it('renders the header and both existing About sections in order, and no footer', () => {
    render(<AboutPage />);
    const hero = document.getElementById('about-hero');
    const whoWeAre = document.getElementById('who-we-are');
    expect(hero).not.toBeNull();
    expect(whoWeAre).not.toBeNull();

    const position = hero!.compareDocumentPosition(whoWeAre!);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    expect(screen.getByTestId('link-home')).toBeInTheDocument();
    expect(document.querySelector('footer')).toBeNull();
  });
});
