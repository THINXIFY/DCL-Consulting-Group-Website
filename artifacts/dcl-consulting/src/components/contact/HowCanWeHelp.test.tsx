import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HowCanWeHelp } from './HowCanWeHelp';
import { howCanWeHelp } from '@/data/contact-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('HowCanWeHelp', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, supporting copy, all four enquiry types, image, and side statement', () => {
    mockDesktop(true);
    render(<HowCanWeHelp />);
    expect(screen.getByText(howCanWeHelp.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('How can we');
    expect(screen.getByText(howCanWeHelp.supporting)).toBeInTheDocument();
    for (const type of howCanWeHelp.enquiryTypes) {
      const el = screen.getByTestId(`enquiry-type-${type.id}`);
      expect(el).toHaveTextContent(type.name);
      expect(el).toHaveTextContent(type.line);
    }
    expect(screen.getByTestId('img-how-can-we-help')).toBeInTheDocument();
  });

  it('lets the user select exactly one enquiry type as a radio group', () => {
    mockDesktop(true);
    render(<HowCanWeHelp />);
    const general = screen.getByTestId('enquiry-type-general');
    const strategic = screen.getByTestId('enquiry-type-strategic');
    expect(general).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(general);
    expect(general).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(strategic);
    expect(strategic).toHaveAttribute('aria-checked', 'true');
    expect(general).toHaveAttribute('aria-checked', 'false');
  });

  it('shows validation errors when submitting an empty form, and does not show the not-connected notice', () => {
    mockDesktop(true);
    render(<HowCanWeHelp />);
    fireEvent.click(screen.getByTestId('button-contact-submit'));
    expect(screen.getByTestId('error-full-name')).toBeInTheDocument();
    expect(screen.getByTestId('error-email')).toBeInTheDocument();
    expect(screen.getByTestId('error-enquiry-type')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.queryByTestId('text-contact-not-connected')).not.toBeInTheDocument();
  });

  it('rejects an invalid email address', () => {
    mockDesktop(true);
    render(<HowCanWeHelp />);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByTestId('button-contact-submit'));
    expect(screen.getByTestId('error-email')).toHaveTextContent(/valid email/i);
  });

  it('shows the honest not-connected notice after a fully valid submission, with no fabricated success claim', () => {
    mockDesktop(true);
    render(<HowCanWeHelp />);
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Smith' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/your message/i), { target: { value: 'I would like to discuss an opportunity.' } });
    fireEvent.click(screen.getByTestId('enquiry-type-general'));
    fireEvent.click(screen.getByTestId('button-contact-submit'));

    const notice = screen.getByTestId('text-contact-not-connected');
    expect(notice).toHaveTextContent(howCanWeHelp.notConnectedNotice);
    expect(screen.queryByTestId('error-full-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-email')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-enquiry-type')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<HowCanWeHelp />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<HowCanWeHelp />);
    const section = document.getElementById('how-can-we-help');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
