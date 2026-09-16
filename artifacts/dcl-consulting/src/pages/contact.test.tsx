import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ContactPage from './contact';

vi.mock('@workspace/api-client-react', () => ({
  useStartRequestInfo: () => ({ mutateAsync: vi.fn() }),
  useResendRequestInfoCode: () => ({ mutateAsync: vi.fn() }),
  useVerifyRequestInfoCode: () => ({ mutateAsync: vi.fn() }),
}));

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('ContactPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all six Contact sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<ContactPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'contact-hero',
      'how-can-we-help',
      'company-information',
      'get-in-touch',
      'what-happens-next',
      'contact-support-cta',
    ]);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
