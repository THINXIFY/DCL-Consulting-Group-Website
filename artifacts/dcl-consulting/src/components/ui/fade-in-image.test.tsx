import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FadeInImage } from './fade-in-image';

describe('FadeInImage', () => {
  it('starts at opacity-0 and animates to opacity-100 once the image fires onLoad', () => {
    render(<FadeInImage data-testid="fade-img" src="/images/test.webp" alt="Test" />);
    const img = screen.getByTestId('fade-img');
    expect(img).toHaveClass('opacity-0');
    expect(img).not.toHaveClass('opacity-100');

    fireEvent.load(img);

    expect(img).toHaveClass('opacity-100', 'dclFadeInImage');
    expect(img).not.toHaveClass('opacity-0');
  });

  it('reveals immediately with no animation class when the image is already cached (complete on mount)', () => {
    Object.defineProperty(HTMLImageElement.prototype, 'complete', { configurable: true, get: () => true });
    render(<FadeInImage data-testid="cached-img" src="/images/test.webp" alt="Test" />);
    const img = screen.getByTestId('cached-img');
    expect(img).toHaveClass('opacity-100');
    expect(img).not.toHaveClass('dclFadeInImage');
    Object.defineProperty(HTMLImageElement.prototype, 'complete', { configurable: true, get: () => false });
  });

  it('preserves caller-supplied className (including its own transition-transform hover classes) and forwards other img props', () => {
    render(
      <FadeInImage
        data-testid="props-img"
        src="/images/test.webp"
        alt="Test"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        loading="lazy"
      />,
    );
    const img = screen.getByTestId('props-img');
    expect(img).toHaveClass('h-full', 'w-full', 'object-cover', 'transition-transform', 'duration-500');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('alt', 'Test');
  });
});
