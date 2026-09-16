import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowUpRight, Lock, X } from 'lucide-react';
import {
  useResendRequestInfoCode,
  useStartRequestInfo,
  useVerifyRequestInfoCode,
} from '@workspace/api-client-react';
import { OtpCodeInput } from './OtpCodeInput';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

type ModalState = 'email' | 'sending' | 'otp' | 'verifying' | 'success' | 'failure' | 'retrying';

const RESEND_COOLDOWN_SECONDS = 60;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapVerifyError(error: string | undefined): string {
  switch (error) {
    case 'invalid_code':
      return 'The verification code is incorrect. Please check the code and try again.';
    case 'expired':
      return 'This verification code has expired. Please request a new code.';
    case 'too_many_attempts':
      return 'Too many incorrect attempts. Please request a new code.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

interface RequestInfoModalProps {
  open: boolean;
  onClose: () => void;
}

export function RequestInfoModal({ open, onClose }: RequestInfoModalProps) {
  const [state, setState] = useState<ModalState>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerFocusRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const startMutation = useStartRequestInfo();
  const resendMutation = useResendRequestInfoCode();
  const verifyMutation = useVerifyRequestInfoCode();

  useEffect(() => {
    if (open) {
      triggerFocusRef.current = document.activeElement as HTMLElement;
    } else {
      triggerFocusRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open || !dialogRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(dialogRef.current, { clearProps: 'all' });
        return;
      }
      // Animate opacity (not autoAlpha) so the dialog never gets a
      // synchronous visibility:hidden applied to it - autoAlpha's initial
      // "from" state would otherwise remove role="dialog" from the
      // accessibility tree for the first frame after mount.
      gsap.fromTo(dialogRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    }, dialogRef);
    return () => ctx.revert();
  }, [open, prefersReducedMotion, state]);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Prefer the first input in the current view (email or OTP field); only
    // fall back to a primary action button on views that have no input
    // (success/failure/retrying). The close (X) button is deliberately
    // excluded so it never steals initial focus.
    const target =
      dialog.querySelector<HTMLElement>('input') ??
      dialog.querySelector<HTMLElement>(
        'button[type="submit"], button[data-testid="button-request-info-close-success"], button[data-testid="button-request-info-try-again"]',
      );
    target?.focus();
  }, [open, state]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function resetAll() {
    setState('email');
    setEmail('');
    setEmailError(null);
    setRequestId(null);
    setCode('');
    setOtpError(null);
    setCooldown(0);
    setIsResending(false);
  }

  function handleClose() {
    if (state === 'sending' || state === 'verifying' || state === 'retrying') return;
    resetAll();
    onClose();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleClose();
      return;
    }
    if (event.key === 'Tab' && dialogRef.current) {
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  async function handleEmailSubmit(event: FormEvent) {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalized) || normalized.length > 254) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError(null);
    setState('sending');
    try {
      const result = await startMutation.mutateAsync({ data: { email: normalized } });
      setEmail(normalized);
      setRequestId(result.requestId);
      setCode('');
      setOtpError(null);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setState('otp');
    } catch {
      setEmailError('We could not send a verification code. Please try again.');
      setState('email');
    }
  }

  async function handleVerifySubmit(event: FormEvent) {
    event.preventDefault();
    if (!requestId || code.length !== 6) return;
    setOtpError(null);
    setState('verifying');
    try {
      const result = await verifyMutation.mutateAsync({ data: { requestId, code } });
      setState(result.status === 'sent' ? 'success' : 'failure');
    } catch (error) {
      const apiError = (error as { data?: { error?: string } })?.data?.error;
      setOtpError(mapVerifyError(apiError));
      setState('otp');
    }
  }

  async function handleResend() {
    if (!requestId || cooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      await resendMutation.mutateAsync({ data: { requestId } });
      setCode('');
      setOtpError(null);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setOtpError('We could not resend the code. Please try again shortly.');
    } finally {
      setIsResending(false);
    }
  }

  function handleChangeEmail() {
    setState('email');
    setRequestId(null);
    setCode('');
    setOtpError(null);
    setCooldown(0);
  }

  async function handleTryAgain() {
    if (!requestId) return;
    setState('retrying');
    try {
      const result = await verifyMutation.mutateAsync({ data: { requestId, code } });
      setState(result.status === 'sent' ? 'success' : 'failure');
    } catch {
      setState('failure');
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080a0d]/70 px-4 py-8 backdrop-blur-[2px]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-info-heading"
        onKeyDown={handleKeyDown}
        className="relative flex max-h-[calc(100vh-32px)] w-full flex-col overflow-y-auto bg-white p-8 sm:p-10"
        style={{ width: 'min(560px, calc(100vw - 28px))' }}
      >
        <button
          type="button"
          aria-label="Close dialog"
          data-testid="button-request-info-close"
          onClick={handleClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center text-[#080a0d]/60 outline-none transition-colors duration-200 hover:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {(state === 'email' || state === 'sending') && (
          <form onSubmit={handleEmailSubmit} noValidate>
            <p className="dclHome__eyebrow text-[#9ca3aa]">Secure Document Access</p>
            <h2
              id="request-info-heading"
              className="dclHome__display mt-4 text-[clamp(1.7rem,4vw,2.3rem)] leading-[1.08] tracking-[-.02em] text-[#080a0d]"
            >
              Access DCL Documents
            </h2>
            <p className="mt-4 text-[15px] leading-6 text-[#35404a]">
              Verify your email address to receive the requested DCL documents securely.
            </p>

            <label htmlFor="request-info-email" className="mt-8 block text-[11px] font-semibold uppercase tracking-[.14em] text-[#6b737a]">
              Email address
            </label>
            <div className="mt-2 flex items-center gap-2 border border-[#080a0d]/20 px-4 py-3 focus-within:border-[#8bbfe8]">
              <Lock size={15} strokeWidth={1.4} className="shrink-0 text-[#8bbfe8]" aria-hidden="true" />
              <input
                id="request-info-email"
                data-testid="input-request-info-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                disabled={state === 'sending'}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full text-[16px] text-[#080a0d] outline-none placeholder:text-[#9ca3aa]"
              />
            </div>
            {emailError && (
              <p role="alert" data-testid="text-request-info-email-error" className="mt-2 text-[13px] text-[#a13b3b]">
                {emailError}
              </p>
            )}

            <button
              type="submit"
              data-testid="button-request-info-send"
              disabled={state === 'sending'}
              className="group mt-8 inline-flex w-full items-center justify-center gap-3 bg-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] disabled:opacity-60"
            >
              {state === 'sending' ? 'Sending Code…' : 'Send Verification Code'}
              {state !== 'sending' && (
                <ArrowUpRight size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
              )}
            </button>

            <p className="mt-5 text-[12px] leading-5 text-[#9ca3aa]">
              Your email address is used only to verify your request and deliver the requested documents.
            </p>
          </form>
        )}

        {(state === 'otp' || state === 'verifying') && (
          <form onSubmit={handleVerifySubmit} noValidate>
            <p className="dclHome__eyebrow text-[#9ca3aa]">Email Verification</p>
            <h2
              id="request-info-heading"
              className="dclHome__display mt-4 text-[clamp(1.7rem,4vw,2.3rem)] leading-[1.08] tracking-[-.02em] text-[#080a0d]"
            >
              Enter your verification code
            </h2>
            <p className="mt-4 text-[15px] leading-6 text-[#35404a]">
              We sent a six-digit verification code to:
              <br />
              <span className="font-medium text-[#080a0d]">{email}</span>
            </p>

            <div className="mt-6">
              <OtpCodeInput value={code} onChange={setCode} disabled={state === 'verifying'} />
            </div>

            {otpError && (
              <p role="alert" data-testid="text-request-info-otp-error" className="mt-3 text-[13px] text-[#a13b3b]">
                {otpError}
              </p>
            )}

            <p className="mt-5 text-[13px] leading-5 text-[#6b737a]">
              <span className="font-medium text-[#080a0d]">Code not visible yet?</span> Check your inbox first, then your
              spam, junk or promotions folder. Delivery may take a minute.
            </p>

            <button
              type="submit"
              data-testid="button-request-info-verify"
              disabled={state === 'verifying' || code.length !== 6}
              className="group mt-6 inline-flex w-full items-center justify-center gap-3 bg-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] disabled:opacity-60"
            >
              {state === 'verifying' ? 'Verifying…' : 'Verify and Send Documents'}
              {state !== 'verifying' && (
                <ArrowUpRight size={15} strokeWidth={1.3} className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
              )}
            </button>

            <div className="mt-5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[.12em]">
              <button
                type="button"
                data-testid="button-request-info-change-email"
                onClick={handleChangeEmail}
                className="text-[#080a0d]/60 underline-offset-4 hover:underline"
              >
                Change Email
              </button>
              <button
                type="button"
                data-testid="button-request-info-resend"
                onClick={handleResend}
                disabled={cooldown > 0 || isResending}
                className="text-[#080a0d] disabled:text-[#9ca3aa]"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : isResending ? 'Resending…' : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {state === 'success' && (
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#8bbfe8]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 13l4 4L19 7" stroke="#8bbfe8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="dclHome__eyebrow mt-6 text-center text-[#9ca3aa]">Verification Complete</p>
            <h2
              id="request-info-heading"
              className="dclHome__display mt-4 text-center text-[clamp(1.7rem,4vw,2.3rem)] leading-[1.1] tracking-[-.02em] text-[#080a0d]"
            >
              Documents sent successfully
            </h2>
            <p className="mt-4 text-center text-[15px] leading-6 text-[#35404a]">
              The requested documents have been sent to your verified email address.
            </p>
            <p className="mt-3 text-center text-[13px] leading-5 text-[#6b737a]">
              Please check your inbox first. If the email is not visible, review your spam, junk or promotions folder.
            </p>
            <button
              type="button"
              data-testid="button-request-info-close-success"
              onClick={handleClose}
              className="mt-8 inline-flex w-full items-center justify-center bg-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              Close Window
            </button>
            <p className="mt-5 text-center text-[12px] leading-5 text-[#9ca3aa]">
              Your email address is used only to securely deliver the requested documents.
            </p>
          </div>
        )}

        {(state === 'failure' || state === 'retrying') && (
          <div>
            <h2
              id="request-info-heading"
              className="dclHome__display text-[clamp(1.7rem,4vw,2.3rem)] leading-[1.1] tracking-[-.02em] text-[#080a0d]"
            >
              We couldn’t send the documents
            </h2>
            <p className="mt-4 text-[15px] leading-6 text-[#35404a]">
              Your email was verified successfully, but we were unable to complete document delivery. Please try again or
              contact DCL.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                data-testid="button-request-info-try-again"
                onClick={handleTryAgain}
                disabled={state === 'retrying'}
                className="inline-flex flex-1 items-center justify-center bg-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] disabled:opacity-60"
              >
                {state === 'retrying' ? 'Retrying…' : 'Try Again'}
              </button>
              <a
                href="#how-can-we-help"
                onClick={handleClose}
                className="inline-flex flex-1 items-center justify-center border border-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors duration-300 hover:border-[#171714] hover:text-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
              >
                Contact DCL
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
