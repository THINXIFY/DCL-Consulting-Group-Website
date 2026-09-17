import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Briefcase, Handshake, MessageCircle, Target } from 'lucide-react';
import { howCanWeHelp } from '@/data/contact-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const SECTION_IMAGE = '/images/general/contact-help.webp';

const ENQUIRY_ICONS: Record<string, typeof MessageCircle> = {
  general: MessageCircle,
  investment: Briefcase,
  strategic: Target,
  partnerships: Handshake,
};

interface FormState {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  enquiryType?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function HowCanWeHelp() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [enquiryType, setEnquiryType] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ fullName: '', email: '', company: '', phone: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclHelp__revealLine', '.dclHelp__fadeUp', '.dclHelp__enquiry', '.dclHelp__imageWrap'], { clearProps: 'all' });
        return;
      }
      gsap.fromTo(
        '.dclHelp__revealLine',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } },
      );
      gsap.fromTo(
        '.dclHelp__fadeUp',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        '.dclHelp__enquiry',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: '.dclHelp__enquiryGrid', start: 'top 82%' } },
      );
      gsap.fromTo(
        '.dclHelp__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.dclHelp__imageWrap', start: 'top 85%' } },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  function updateField<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Please enter your full name.';
    if (!form.email.trim()) nextErrors.email = 'Please enter your email address.';
    else if (!EMAIL_PATTERN.test(form.email.trim())) nextErrors.email = 'Please enter a valid email address.';
    if (!enquiryType) nextErrors.enquiryType = 'Please select an enquiry type.';
    if (!form.message.trim()) nextErrors.message = 'Please enter your message.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    } else {
      setSubmitted(false);
    }
  }

  return (
    <section id="how-can-we-help" ref={rootRef} aria-labelledby="how-can-we-help-title" className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="dclHome__eyebrow dclHelp__fadeUp text-[#6b737a]">{howCanWeHelp.label}</p>
            <h2 id="how-can-we-help-title" className="dclHome__display mt-5 text-[clamp(2.1rem,3.8vw,3.1rem)] leading-[1.06] tracking-[-.03em] text-[#080a0d]">
              <span className="block overflow-hidden"><span className="dclHelp__revealLine block">{howCanWeHelp.headlineLines[0]}</span></span>
              <span className="block overflow-hidden"><span className="dclHelp__revealLine block">{howCanWeHelp.headlineLines[1]}</span></span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="dclHelp__fadeUp max-w-[440px] text-[16px] leading-7 text-[#35404a] lg:text-right lg:ml-auto">{howCanWeHelp.supporting}</p>
          </div>
        </div>

        <div
          role="radiogroup"
          aria-required="true"
          aria-label="Enquiry type"
          className="dclHelp__enquiryGrid mt-12 grid grid-cols-1 gap-px border border-[#080a0d]/12 bg-[#080a0d]/12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4"
        >
          {howCanWeHelp.enquiryTypes.map((type) => {
            const Icon = ENQUIRY_ICONS[type.id] ?? MessageCircle;
            const active = enquiryType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                role="radio"
                aria-checked={active}
                data-testid={`enquiry-type-${type.id}`}
                data-active={active}
                onClick={() => {
                  setEnquiryType(type.id);
                  setErrors((prev) => ({ ...prev, enquiryType: undefined }));
                }}
                className="dclHelp__enquiry flex flex-col items-start gap-3 bg-white p-6 text-left outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                style={{
                  borderTop: active ? '2px solid #8bbfe8' : '2px solid transparent',
                  borderBottom: active ? '2px solid #8bbfe8' : '2px solid transparent',
                  backgroundColor: active ? '#f2f4f6' : '#ffffff',
                }}
              >
                <Icon size={18} strokeWidth={1.3} className="text-[#8bbfe8]" aria-hidden="true" />
                <div>
                  <p className="text-[15px] font-semibold text-[#080a0d]">{type.name}</p>
                  <p className="mt-1.5 text-[13.5px] leading-5 text-[#6b737a]">{type.line}</p>
                </div>
              </button>
            );
          })}
        </div>
        {errors.enquiryType && (
          <p data-testid="error-enquiry-type" role="alert" className="mt-3 text-[13px] text-[#9a3b3b]">
            {errors.enquiryType}
          </p>
        )}

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <form onSubmit={handleSubmit} noValidate className="lg:col-span-8" data-testid="contact-form">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-full-name" className="text-[13px] font-medium text-[#35404a]">
                  Full name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-full-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'contact-full-name-error' : undefined}
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Your full name"
                  className="mt-2 w-full border-b border-[#080a0d]/20 bg-transparent py-3 text-[16px] text-[#080a0d] outline-none transition-colors duration-300 placeholder:text-[#9ca3aa] focus:border-[#8bbfe8]"
                />
                {errors.fullName && (
                  <p id="contact-full-name-error" data-testid="error-full-name" role="alert" className="mt-1.5 text-[13px] text-[#9a3b3b]">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className="text-[13px] font-medium text-[#35404a]">
                  Email address <span aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="you@company.com"
                  className="mt-2 w-full border-b border-[#080a0d]/20 bg-transparent py-3 text-[16px] text-[#080a0d] outline-none transition-colors duration-300 placeholder:text-[#9ca3aa] focus:border-[#8bbfe8]"
                />
                {errors.email && (
                  <p id="contact-email-error" data-testid="error-email" role="alert" className="mt-1.5 text-[13px] text-[#9a3b3b]">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-company" className="text-[13px] font-medium text-[#35404a]">
                  Company / Organisation
                </label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  value={form.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  placeholder="Your company (optional)"
                  className="mt-2 w-full border-b border-[#080a0d]/20 bg-transparent py-3 text-[16px] text-[#080a0d] outline-none transition-colors duration-300 placeholder:text-[#9ca3aa] focus:border-[#8bbfe8]"
                />
              </div>

              <div>
                <label htmlFor="contact-phone" className="text-[13px] font-medium text-[#35404a]">
                  Phone number
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Your phone number (optional)"
                  className="mt-2 w-full border-b border-[#080a0d]/20 bg-transparent py-3 text-[16px] text-[#080a0d] outline-none transition-colors duration-300 placeholder:text-[#9ca3aa] focus:border-[#8bbfe8]"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="contact-message" className="text-[13px] font-medium text-[#35404a]">
                  Your message <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="How can we help?"
                  className="mt-2 w-full resize-none border-b border-[#080a0d]/20 bg-transparent py-3 text-[16px] text-[#080a0d] outline-none transition-colors duration-300 placeholder:text-[#9ca3aa] focus:border-[#8bbfe8]"
                />
                {errors.message && (
                  <p id="contact-message-error" data-testid="error-message" role="alert" className="mt-1.5 text-[13px] text-[#9a3b3b]">
                    {errors.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              data-testid="button-contact-submit"
              className="group mt-8 inline-flex items-center gap-3 bg-[#080a0d] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white transition-colors duration-300 hover:bg-[#171714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {howCanWeHelp.submitLabel}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </button>

            {submitted && (
              <p data-testid="text-contact-not-connected" role="status" className="mt-5 max-w-[520px] text-[14px] leading-6 text-[#6b737a]">
                {howCanWeHelp.notConnectedNotice}
              </p>
            )}
          </form>

          <div className="lg:col-span-4">
            <div className="dclHelp__imageWrap relative aspect-[3/4] w-full overflow-hidden">
              <img loading="lazy" decoding="async"
                data-testid="img-how-can-we-help"
                className="h-full w-full scale-105 object-cover object-center"
                src={SECTION_IMAGE}
                alt="Beige stucco multi-story building facade lit by warm late-afternoon sun"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080a0d]/55 via-transparent to-transparent" />
              <div data-testid="text-how-can-we-help-statement" className="absolute bottom-5 left-5 right-5">
                {howCanWeHelp.sideStatementLines.map((line) => (
                  <p key={line} className="dclHome__display text-[1.3rem] leading-[1.2] text-white">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
