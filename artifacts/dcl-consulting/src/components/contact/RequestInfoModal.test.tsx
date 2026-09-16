import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RequestInfoModal } from './RequestInfoModal';

const mutateStart = vi.fn();
const mutateResend = vi.fn();
const mutateVerify = vi.fn();

vi.mock('@workspace/api-client-react', () => ({
  useStartRequestInfo: () => ({ mutateAsync: mutateStart }),
  useResendRequestInfoCode: () => ({ mutateAsync: mutateResend }),
  useVerifyRequestInfoCode: () => ({ mutateAsync: mutateVerify }),
}));

function fillOtp(digits: string) {
  for (const [index, digit] of digits.split('').entries()) {
    fireEvent.change(screen.getByTestId(`otp-digit-${index}`), { target: { value: digit } });
  }
}

describe('RequestInfoModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    render(<RequestInfoModal open={false} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('rejects an invalid email before calling the API', () => {
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    expect(screen.getByTestId('text-request-info-email-error')).toBeInTheDocument();
    expect(mutateStart).not.toHaveBeenCalled();
  });

  it('normalizes and submits a valid email, moving to the OTP state', async () => {
    mutateStart.mockResolvedValue({ requestId: 'req-1' });
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: '  Visitor@Example.com ' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    await waitFor(() => expect(mutateStart).toHaveBeenCalledWith({ data: { email: 'visitor@example.com' } }));
    expect(await screen.findByTestId('button-request-info-verify')).toBeInTheDocument();
  });

  it('shows the incorrect-code message and stays on the OTP screen', async () => {
    mutateStart.mockResolvedValue({ requestId: 'req-1' });
    mutateVerify.mockRejectedValue({ data: { error: 'invalid_code' } });
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: 'visitor@example.com' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    await screen.findByTestId('button-request-info-verify');

    fillOtp('123456');
    fireEvent.click(screen.getByTestId('button-request-info-verify'));

    expect(await screen.findByTestId('text-request-info-otp-error')).toHaveTextContent(
      'The verification code is incorrect. Please check the code and try again.',
    );
  });

  it('shows the expired-code message', async () => {
    mutateStart.mockResolvedValue({ requestId: 'req-1' });
    mutateVerify.mockRejectedValue({ data: { error: 'expired' } });
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: 'visitor@example.com' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    await screen.findByTestId('button-request-info-verify');
    fillOtp('123456');
    fireEvent.click(screen.getByTestId('button-request-info-verify'));
    expect(await screen.findByTestId('text-request-info-otp-error')).toHaveTextContent(
      'This verification code has expired. Please request a new code.',
    );
  });

  it('shows the success state once verification and delivery both succeed', async () => {
    mutateStart.mockResolvedValue({ requestId: 'req-1' });
    mutateVerify.mockResolvedValue({ status: 'sent' });
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: 'visitor@example.com' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    await screen.findByTestId('button-request-info-verify');
    fillOtp('123456');
    fireEvent.click(screen.getByTestId('button-request-info-verify'));
    expect(await screen.findByText('Documents sent successfully')).toBeInTheDocument();
  });

  it('shows the failure state when verification succeeds but delivery fails', async () => {
    mutateStart.mockResolvedValue({ requestId: 'req-1' });
    mutateVerify.mockResolvedValue({ status: 'failed' });
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: 'visitor@example.com' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    await screen.findByTestId('button-request-info-verify');
    fillOtp('123456');
    fireEvent.click(screen.getByTestId('button-request-info-verify'));
    expect(await screen.findByText('We couldn’t send the documents')).toBeInTheDocument();
  });

  it('change email returns to the email state', async () => {
    mutateStart.mockResolvedValue({ requestId: 'req-1' });
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: 'visitor@example.com' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    await screen.findByTestId('button-request-info-verify');
    fireEvent.click(screen.getByTestId('button-request-info-change-email'));
    expect(screen.getByTestId('input-request-info-email')).toBeInTheDocument();
  });

  it('the resend button is disabled during the cooldown', async () => {
    mutateStart.mockResolvedValue({ requestId: 'req-1' });
    render(<RequestInfoModal open onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('input-request-info-email'), { target: { value: 'visitor@example.com' } });
    fireEvent.click(screen.getByTestId('button-request-info-send'));
    expect(await screen.findByTestId('button-request-info-resend')).toBeDisabled();
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(<RequestInfoModal open onClose={onClose} />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
