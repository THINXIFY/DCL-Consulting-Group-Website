# DCL Homepage Remaining Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Who We Advise, Why DCL, DCL at a Glance, Our Philosophy, and Final CTA to `artifacts/dcl-consulting`, after Industries, per `docs/superpowers/specs/2026-09-12-dcl-homepage-remaining-sections-design.md`. No changes to Hero/About/Expertise/Approach/Industries/Header. No footer.

**Architecture:** One component per section under `src/components/sections/`, new data arrays appended to `src/data/home-content.ts`, GSAP entrance/scroll animations following the exact conventions already in the codebase (`ensureGsapRegistered`, `useMediaQuery`, `getActiveIndex`, `useMagnetic`).

**Tech Stack:** Same as the rest of the project - React 19, Tailwind v4, GSAP, Vitest + React Testing Library.

---

## Notes for the implementer

- Do not edit `Hero.tsx`, `About.tsx`, `Expertise.tsx`, `Approach.tsx`, `Industries.tsx`, or `Header.tsx`.
- For any continuous scroll-driven value (a progress-rule width/height that must track scroll smoothly), write directly to a DOM ref inside the `ScrollTrigger` `onUpdate` callback instead of `useState`, to avoid a React re-render on every scroll frame. Only call `setState` when a *discrete* bucket (e.g. `getActiveIndex` result) actually changes.
- Eyebrow tagline above every heading in this batch except Final CTA (a closing CTA is not "content" the way the others are - it has no plain-language section name to label).
- No numbering, no em-dashes, in this batch either.

---

## Task 1: Extend content data

**Files:**
- Modify: `src/data/home-content.ts`
- Modify: `src/data/home-content.test.ts`

- [ ] **Step 1: Write the failing tests**

Append to `src/data/home-content.test.ts` (add these `it` blocks inside the existing `describe('home-content', ...)`, and add `companyFacts, philosophy, whoWeAdvise, whyDcl` to the import line):

```ts
  it('has three who-we-advise audiences and four why-dcl qualities, no numbering', () => {
    expect(whoWeAdvise).toHaveLength(3);
    expect(whyDcl).toHaveLength(4);
    for (const item of [...whoWeAdvise, ...whyDcl]) {
      expect(item).not.toHaveProperty('number');
      expect(item.title).toBeTruthy();
      expect(item.copy).toBeTruthy();
    }
  });

  it('has exactly the five real company facts from the brief, nothing invented', () => {
    expect(companyFacts).toEqual([
      { label: 'Company', value: 'DCL Consulting and Investments Limited' },
      { label: 'Company Type', value: 'Private Limited Company' },
      { label: 'Registered In', value: 'England & Wales' },
      { label: 'Company Number', value: '10086906' },
      { label: 'Director', value: 'David Christopher Lebond' },
    ]);
  });

  it('has five philosophy statements, each with a highlight word present in its own text', () => {
    expect(philosophy).toHaveLength(5);
    for (const item of philosophy) {
      expect(item.text).toContain(item.highlight);
    }
  });

  it('has no numbering or em-dash characters in the new arrays', () => {
    const strings = [...allStrings(whoWeAdvise), ...allStrings(whyDcl), ...allStrings(companyFacts), ...allStrings(philosophy)];
    for (const s of strings) {
      expect(s).not.toMatch(NUMBERING_PATTERN);
      expect(s).not.toMatch(DASH_CHARS);
    }
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter @workspace/dcl-consulting test -- home-content`
Expected: FAIL - `whoWeAdvise` etc. not exported.

- [ ] **Step 3: Add the new data**

Append to `src/data/home-content.ts`:

```ts
export interface AudienceItem {
  title: string;
  copy: string;
}

export interface QualityItem {
  title: string;
  copy: string;
}

export interface CompanyFact {
  label: string;
  value: string;
}

export interface PhilosophyStatement {
  text: string;
  highlight: string;
}

export const whoWeAdvise: AudienceItem[] = [
  {
    title: 'Private Capital',
    copy: 'Independent perspective for private investors evaluating opportunities, commercial risks and strategic choices.',
  },
  {
    title: 'Corporate Ambition',
    copy: 'Structured analysis for businesses considering growth, expansion, partnerships or other significant commercial decisions.',
  },
  {
    title: 'Strategic Opportunity',
    copy: 'Decision support when an opportunity is complex, unfamiliar or requires deeper independent scrutiny.',
  },
];

export const whyDcl: QualityItem[] = [
  {
    title: 'Independent Perspective',
    copy: 'A considered view shaped by the opportunity and the evidence rather than a predetermined conclusion.',
  },
  {
    title: 'Analytical Discipline',
    copy: 'Structured evaluation focused on the commercial, financial and strategic factors most relevant to the decision.',
  },
  {
    title: 'Commercial Understanding',
    copy: 'Attention to how businesses, markets and opportunities work in practice, not only how they appear on paper.',
  },
  {
    title: 'Clear Communication',
    copy: 'Complex information translated into a clearer view of what matters, what remains uncertain and what deserves attention.',
  },
];

export const companyFacts: CompanyFact[] = [
  { label: 'Company', value: 'DCL Consulting and Investments Limited' },
  { label: 'Company Type', value: 'Private Limited Company' },
  { label: 'Registered In', value: 'England & Wales' },
  { label: 'Company Number', value: '10086906' },
  { label: 'Director', value: 'David Christopher Lebond' },
];

export const philosophy: PhilosophyStatement[] = [
  { text: 'Understand before concluding.', highlight: 'Understand' },
  { text: 'Challenge assumptions before accepting them.', highlight: 'Challenge' },
  { text: 'Consider risk alongside opportunity.', highlight: 'risk' },
  { text: 'Focus on what materially changes the decision.', highlight: 'materially' },
  { text: 'Communicate the conclusion clearly.', highlight: 'clearly' },
];
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter @workspace/dcl-consulting test -- home-content`
Expected: PASS, 8 tests total in this file.

- [ ] **Step 5: Commit**

```bash
git add src/data/home-content.ts src/data/home-content.test.ts
git commit -m "feat: add data for Who We Advise, Why DCL, DCL at a Glance, Our Philosophy"
```

---

## Task 2: Who We Advise

**Files:**
- Create: `src/components/sections/WhoWeAdvise.tsx`
- Test: `src/components/sections/WhoWeAdvise.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhoWeAdvise } from './WhoWeAdvise';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('WhoWeAdvise', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, and all three audiences with copy always in the DOM', () => {
    mockDesktop(true);
    render(<WhoWeAdvise />);
    expect(screen.getByTestId('text-advise-eyebrow')).toHaveTextContent('Who we advise');
    expect(screen.getByText(/perspective for decisions that carry weight/i)).toBeInTheDocument();
    for (const title of ['Private Capital', 'Corporate Ambition', 'Strategic Opportunity']) {
      expect(screen.getByTestId(`audience-${title.toLowerCase().replaceAll(' ', '-')}`)).toHaveTextContent(title);
    }
  });

  it('marks the first audience active by default on desktop and updates on focus', () => {
    mockDesktop(true);
    render(<WhoWeAdvise />);
    expect(screen.getByTestId('audience-private-capital')).toHaveAttribute('data-active', 'true');
    fireEvent.focus(screen.getByTestId('audience-corporate-ambition'));
    expect(screen.getByTestId('audience-corporate-ambition')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('audience-private-capital')).toHaveAttribute('data-active', 'false');
  });

  it('shows every audience without requiring interaction on mobile', () => {
    mockDesktop(false);
    render(<WhoWeAdvise />);
    for (const title of ['Private Capital', 'Corporate Ambition', 'Strategic Opportunity']) {
      expect(screen.getByTestId(`audience-${title.toLowerCase().replaceAll(' ', '-')}`)).toHaveAttribute('data-active', 'true');
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @workspace/dcl-consulting test -- WhoWeAdvise`
Expected: FAIL - module not found.

- [ ] **Step 3: Implement**

```tsx
import { useEffect, useRef, useState } from 'react';
import { whoWeAdvise } from '@/data/home-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

const TINTS = ['#f2f4f6', '#eff3f7', '#edf1f6'];

function slug(title: string) {
  return title.toLowerCase().replaceAll(' ', '-');
}

export function WhoWeAdvise() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (!rootRef.current || !listRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: listRef.current,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          const next = getActiveIndex(self.progress, whoWeAdvise.length);
          if (next !== activeIndexRef.current) {
            activeIndexRef.current = next;
            setActiveIndex(next);
          }
        },
      });
      return () => trigger.kill();
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dclAdvise__fadeUp',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="who-we-advise"
      ref={rootRef}
      aria-labelledby="advise-title"
      className="px-6 py-24 transition-colors duration-700 sm:px-10 sm:py-32 lg:px-16 lg:py-40"
      style={{ backgroundColor: isDesktop ? TINTS[activeIndex] : TINTS[0] }}
    >
      <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[.62fr_1.38fr] lg:gap-24">
        <div className={isDesktop ? 'lg:sticky lg:top-24 lg:self-start' : undefined}>
          <p data-testid="text-advise-eyebrow" className="dclHome__eyebrow dclAdvise__fadeUp mb-5 text-[#6b737a]">
            Who we advise
          </p>
          <h2 id="advise-title" className="dclHome__display dclAdvise__fadeUp max-w-[480px] text-[clamp(2.6rem,5.4vw,4.6rem)] leading-[.95] tracking-[-.04em] text-[#080a0d]">
            Perspective for decisions that carry weight.
          </h2>
          <p className="dclAdvise__fadeUp mt-8 max-w-[380px] text-[16px] leading-7 text-[#35404a] sm:text-[17px]">
            DCL works with investors and businesses seeking a clearer understanding of important opportunities, risks and strategic choices before significant decisions are made.
          </p>
        </div>
        <div ref={listRef} className="border-t border-[#080a0d]/15">
          {whoWeAdvise.map((item, index) => {
            const active = isDesktop ? activeIndex === index : true;
            return (
              <div
                key={item.title}
                data-testid={`audience-${slug(item.title)}`}
                data-active={active}
                tabIndex={isDesktop ? 0 : undefined}
                onMouseEnter={() => isDesktop && setActiveIndex(index)}
                onFocus={() => isDesktop && setActiveIndex(index)}
                className="dclAdvise__fadeUp relative overflow-hidden border-b border-[#080a0d]/15 py-10 outline-none focus-visible:ring-2 focus-visible:ring-[#8bbfe8] sm:py-14"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-serif text-[16vw] uppercase leading-none text-[#080a0d] transition-opacity duration-700 lg:text-[9vw]"
                  style={{ opacity: active ? 0.045 : 0 }}
                >
                  {item.title}
                </span>
                <div className="relative transition-opacity duration-500" style={{ opacity: active ? 1 : 0.5 }}>
                  <h3 className="dclHome__display text-[clamp(1.9rem,3.2vw,3rem)] leading-[.95] tracking-[-.03em] text-[#080a0d]">{item.title}</h3>
                  <span
                    className="mt-4 block h-px bg-[#8bbfe8] transition-transform duration-500"
                    style={{ width: '64px', transform: `scaleX(${active ? 1 : 0})`, transformOrigin: 'left center' }}
                  />
                  <p className="mt-5 max-w-[440px] text-[15px] leading-6 text-[#35404a] sm:text-[16px]">{item.copy}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @workspace/dcl-consulting test -- WhoWeAdvise`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/WhoWeAdvise.tsx src/components/sections/WhoWeAdvise.test.tsx
git commit -m "feat: add Who We Advise section"
```

---

## Task 3: Why DCL

**Files:**
- Create: `src/components/sections/WhyDcl.tsx`
- Test: `src/components/sections/WhyDcl.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhyDcl } from './WhyDcl';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('WhyDcl', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, and all four qualities', () => {
    mockDesktop(true);
    render(<WhyDcl />);
    expect(screen.getByTestId('text-why-eyebrow')).toHaveTextContent('Why DCL');
    for (const title of ['Independent Perspective', 'Analytical Discipline', 'Commercial Understanding', 'Clear Communication']) {
      expect(screen.getByTestId(`quality-${title.toLowerCase().replaceAll(' ', '-')}`)).toHaveTextContent(title);
    }
  });

  it('expands only the focused row on desktop and collapses the rest', () => {
    mockDesktop(true);
    render(<WhyDcl />);
    const row = screen.getByTestId('quality-analytical-discipline');
    fireEvent.focus(row);
    expect(row).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('quality-independent-perspective')).toHaveAttribute('data-active', 'false');
  });

  it('shows every quality expanded on mobile with no interaction required', () => {
    mockDesktop(false);
    render(<WhyDcl />);
    for (const title of ['Independent Perspective', 'Analytical Discipline', 'Commercial Understanding', 'Clear Communication']) {
      expect(screen.getByTestId(`quality-${title.toLowerCase().replaceAll(' ', '-')}`)).toHaveAttribute('data-active', 'true');
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @workspace/dcl-consulting test -- WhyDcl`
Expected: FAIL - module not found.

- [ ] **Step 3: Implement**

```tsx
import { useEffect, useRef, useState } from 'react';
import { whyDcl } from '@/data/home-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(title: string) {
  return title.toLowerCase().replaceAll(' ', '-');
}

export function WhyDcl() {
  const rootRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dclWhy__row',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="why-dcl" ref={rootRef} aria-labelledby="why-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <p data-testid="text-why-eyebrow" className="dclHome__eyebrow mb-5 text-[#8bbfe8]">
          Why DCL
        </p>
        <h2 id="why-title" className="dclHome__display max-w-[620px] text-[clamp(2.6rem,5.6vw,5.2rem)] leading-[.92] tracking-[-.04em]">
          A disciplined way to see <em className="text-[#c6e3fa] not-italic">the decision.</em>
        </h2>
        <p className="mt-6 max-w-[560px] text-[16px] leading-7 text-white/58">
          DCL's approach is designed around clarity, independence and disciplined evaluation, focusing attention on the factors that matter most.
        </p>

        <div className="mt-16 border-t border-white/20" onMouseLeave={() => isDesktop && setActiveIndex(null)}>
          {whyDcl.map((item, index) => {
            const active = isDesktop ? activeIndex === index : true;
            const indent = isDesktop ? index * 28 : 0;
            return (
              <div
                key={item.title}
                data-testid={`quality-${slug(item.title)}`}
                data-active={active}
                tabIndex={isDesktop ? 0 : undefined}
                onMouseEnter={() => isDesktop && setActiveIndex(index)}
                onFocus={() => isDesktop && setActiveIndex(index)}
                onBlur={() => isDesktop && setActiveIndex(null)}
                className="dclWhy__row border-b border-white/20 py-8 outline-none transition-[opacity,margin-left] duration-400 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                style={{ marginLeft: `${indent}px`, opacity: isDesktop && activeIndex !== null && !active ? 0.5 : 1 }}
              >
                <div className="flex items-baseline gap-5 transition-transform duration-400" style={{ transform: active ? 'translateX(12px)' : 'translateX(0)' }}>
                  <h3 className="dclHome__display text-[clamp(1.8rem,3vw,2.7rem)] leading-none tracking-[-.03em]">{item.title}</h3>
                </div>
                <span
                  className="mt-4 block h-px bg-[#8bbfe8] transition-transform duration-500"
                  style={{ width: '72px', transform: `scaleX(${active ? 1 : 0})`, transformOrigin: 'left center' }}
                />
                <p
                  className="overflow-hidden text-[15px] leading-6 text-white/60 transition-all duration-500 sm:text-[16px]"
                  style={{ marginTop: active ? '20px' : '0px', maxHeight: active ? '120px' : '0px', opacity: active ? 1 : 0 }}
                >
                  {item.copy}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @workspace/dcl-consulting test -- WhyDcl`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/WhyDcl.tsx src/components/sections/WhyDcl.test.tsx
git commit -m "feat: add Why DCL section"
```

---

## Task 4: DCL at a Glance

**Files:**
- Create: `src/components/sections/DclAtAGlance.tsx`
- Test: `src/components/sections/DclAtAGlance.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @workspace/dcl-consulting test -- DclAtAGlance`
Expected: FAIL - module not found.

- [ ] **Step 3: Implement**

```tsx
import { useEffect, useRef } from 'react';
import { companyFacts } from '@/data/home-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(label: string) {
  return label.toLowerCase().replaceAll(' ', '-');
}

export function DclAtAGlance() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclGlance__revealLine', '.dclGlance__fadeUp', '.dclGlance__rule'], { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclGlance__revealLine',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
        },
      );

      gsap.fromTo(
        '.dclGlance__fadeUp',
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 65%' },
        },
      );

      gsap.fromTo(
        '.dclGlance__rule',
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 60%' },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="dcl-at-a-glance" ref={rootRef} aria-labelledby="glance-title" className="bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1200px]">
        <p data-testid="text-glance-eyebrow" className="dclHome__eyebrow dclGlance__fadeUp mb-6 text-[#6b737a]">
          DCL at a glance
        </p>
        <h2 id="glance-title" className="dclHome__display max-w-[720px] text-[clamp(2.4rem,5vw,4.4rem)] leading-[.95] tracking-[-.04em] text-[#080a0d]">
          <span className="block overflow-hidden"><span className="dclGlance__revealLine block">Established structure.</span></span>
          <span className="block overflow-hidden"><span className="dclGlance__revealLine block">Independent perspective.</span></span>
        </h2>
        <p className="dclGlance__fadeUp mt-8 max-w-[540px] text-[16px] leading-7 text-[#35404a] sm:text-[17px]">
          DCL Consulting and Investments Limited is a private limited company registered in England and Wales, providing investment consulting and strategic decision support.
        </p>

        <div className="dclGlance__rule mt-16 h-px w-full bg-[#080a0d]/20" />
        <div className="mt-2">
          {companyFacts.map((fact) => (
            <div
              key={fact.label}
              data-testid={`fact-${slug(fact.label)}`}
              className="dclGlance__fadeUp flex flex-col gap-1 border-b border-[#080a0d]/12 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="dclHome__eyebrow text-[#8a939b]">{fact.label}</span>
              <span className="dclHome__display text-[1.35rem] leading-tight text-[#080a0d] sm:text-[1.6rem]">{fact.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @workspace/dcl-consulting test -- DclAtAGlance`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/DclAtAGlance.tsx src/components/sections/DclAtAGlance.test.tsx
git commit -m "feat: add DCL at a Glance section"
```

---

## Task 5: Our Philosophy

**Files:**
- Create: `src/components/sections/OurPhilosophy.tsx`
- Test: `src/components/sections/OurPhilosophy.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OurPhilosophy } from './OurPhilosophy';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('OurPhilosophy', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow and headline', () => {
    mockDesktop(true);
    render(<OurPhilosophy />);
    expect(screen.getByTestId('text-philosophy-eyebrow')).toHaveTextContent('Our philosophy');
    expect(screen.getByText(/clarity before capital/i)).toBeInTheDocument();
  });

  it('shows only the first statement active on desktop, with its highlighted word wrapped', () => {
    mockDesktop(true);
    render(<OurPhilosophy />);
    const first = screen.getByTestId('statement-0');
    expect(first).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('statement-1')).toHaveAttribute('data-active', 'false');
    expect(within(first).getByText('Understand')).toHaveClass('dclPhilosophy__highlight');
  });

  it('shows every statement active on mobile with no pinning required', () => {
    mockDesktop(false);
    render(<OurPhilosophy />);
    for (let i = 0; i < 5; i++) {
      expect(screen.getByTestId(`statement-${i}`)).toHaveAttribute('data-active', 'true');
    }
  });
});
```

Add `import { within } from '@testing-library/react';` alongside the existing `render, screen` import.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @workspace/dcl-consulting test -- OurPhilosophy`
Expected: FAIL - module not found.

- [ ] **Step 3: Implement**

```tsx
import { useEffect, useRef, useState } from 'react';
import { philosophy } from '@/data/home-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

function renderStatement(text: string, highlight: string) {
  const index = text.indexOf(highlight);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="dclPhilosophy__highlight text-[#8bbfe8]">{highlight}</span>
      {text.slice(index + highlight.length)}
    </>
  );
}

export function OurPhilosophy() {
  const rootRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const progressRuleRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (!rootRef.current || !pinWrapRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: pinWrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          if (progressRuleRef.current) {
            progressRuleRef.current.style.transform = `scaleX(${self.progress})`;
          }
          const next = getActiveIndex(self.progress, philosophy.length);
          if (next !== activeIndexRef.current) {
            activeIndexRef.current = next;
            setActiveIndex(next);
          }
        },
      });
      return () => trigger.kill();
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dclPhilosophy__intro',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
        },
      );

      if (!isDesktop) {
        gsap.fromTo(
          '.dclPhilosophy__mobileStatement',
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.dclPhilosophy__mobileList', start: 'top 80%' },
          },
        );
      }
    }, rootRef);
    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  return (
    <section id="our-philosophy" ref={rootRef} aria-labelledby="philosophy-title" className="bg-[#080a0d] text-white">
      <div className="mx-auto max-w-[1440px] px-6 pt-24 sm:px-10 sm:pt-32 lg:px-16 lg:pt-40">
        <p data-testid="text-philosophy-eyebrow" className="dclHome__eyebrow dclPhilosophy__intro mb-5 text-[#8bbfe8]">
          Our philosophy
        </p>
        <h2 id="philosophy-title" className="dclHome__display dclPhilosophy__intro max-w-[600px] text-[clamp(2.6rem,5.4vw,4.8rem)] leading-[.94] tracking-[-.04em]">
          Clarity before capital.
        </h2>
        <p className="dclPhilosophy__intro mt-6 max-w-[520px] text-[16px] leading-7 text-white/58">
          Good decisions begin with understanding the opportunity clearly, testing assumptions and identifying what can materially influence the outcome.
        </p>
      </div>

      {isDesktop ? (
        <div ref={pinWrapRef} className="relative" style={{ height: `${philosophy.length * 100}vh` }}>
          <div className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-16">
            <div className="relative w-full max-w-[900px]">
              {philosophy.map((item, index) => (
                <p
                  key={item.text}
                  data-testid={`statement-${index}`}
                  data-active={activeIndex === index}
                  className="dclHome__display absolute inset-0 flex items-center justify-center text-center text-[clamp(2rem,4.6vw,4rem)] leading-[1.05] tracking-[-.03em] transition-opacity duration-700"
                  style={{ opacity: activeIndex === index ? 1 : 0 }}
                >
                  {renderStatement(item.text, item.highlight)}
                </p>
              ))}
            </div>
            <div className="absolute bottom-16 h-px w-full max-w-[300px] bg-white/15">
              <div ref={progressRuleRef} className="h-full origin-left bg-[#8bbfe8]" style={{ transform: 'scaleX(0)' }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="dclPhilosophy__mobileList mx-auto flex max-w-[720px] flex-col gap-14 px-6 py-20 sm:px-10">
          {philosophy.map((item, index) => (
            <p
              key={item.text}
              data-testid={`statement-${index}`}
              data-active={true}
              className="dclPhilosophy__mobileStatement dclHome__display text-[clamp(1.8rem,7vw,2.6rem)] leading-[1.1] tracking-[-.03em]"
            >
              {renderStatement(item.text, item.highlight)}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @workspace/dcl-consulting test -- OurPhilosophy`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/OurPhilosophy.tsx src/components/sections/OurPhilosophy.test.tsx
git commit -m "feat: add Our Philosophy section"
```

---

## Task 6: Final CTA

**Files:**
- Create: `src/components/sections/FinalCta.tsx`
- Test: `src/components/sections/FinalCta.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinalCta } from './FinalCta';

describe('FinalCta', () => {
  it('renders the headline, supporting copy, and both CTAs with the brief-specified priority', () => {
    render(<FinalCta />);
    expect(screen.getByText(/bring greater clarity to the next decision/i)).toBeInTheDocument();
    expect(screen.getByText(/independent perspective\. structured analysis\. clearer decisions\./i)).toBeInTheDocument();

    const primary = screen.getByTestId('link-final-start-conversation');
    expect(primary).toHaveTextContent('Start a Conversation');
    expect(primary).toHaveAttribute('href', '#about');

    const secondary = screen.getByTestId('link-final-explore-expertise');
    expect(secondary).toHaveTextContent('Explore Our Expertise');
    expect(secondary).toHaveAttribute('href', '#expertise');
  });

  it('contains no em-dash characters', () => {
    render(<FinalCta />);
    const section = document.getElementById('final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @workspace/dcl-consulting test -- FinalCta`
Expected: FAIL - module not found.

- [ ] **Step 3: Implement**

```tsx
import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMagnetic } from '@/hooks/use-magnetic';

export function FinalCta() {
  const rootRef = useRef<HTMLElement>(null);
  const startRef = useRef<HTMLAnchorElement>(null);
  const exploreRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useMagnetic(startRef, { strength: 0.3 });
  useMagnetic(exploreRef, { strength: 0.3 });

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclFinal__revealLine', '.dclFinal__fadeUp', '.dclFinal__rule'], { clearProps: 'all' });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      });
      tl.fromTo('.dclFinal__revealLine', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.1 })
        .fromTo('.dclFinal__fadeUp', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.5')
        .fromTo('.dclFinal__rule', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.7 }, '-=0.3')
        .fromTo('.dclFinal__cta', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.3');
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="final-cta" ref={rootRef} aria-labelledby="final-cta-title" className="bg-[#080a0d] px-6 py-24 text-center text-white sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[900px]">
        <h2 id="final-cta-title" className="dclHome__display text-[clamp(2.6rem,6vw,5.6rem)] leading-[.95] tracking-[-.04em]">
          <span className="block overflow-hidden"><span className="dclFinal__revealLine block">Bring greater clarity</span></span>
          <span className="block overflow-hidden"><span className="dclFinal__revealLine block text-[#c6e3fa]">to the next decision.</span></span>
        </h2>
        <p className="dclFinal__fadeUp mx-auto mt-8 max-w-[560px] text-[16px] leading-7 text-white/65 sm:text-[18px]">
          Speak with DCL about an investment opportunity, strategic decision or business assessment that would benefit from independent perspective and disciplined analysis.
        </p>

        <div className="dclFinal__rule mx-auto mt-14 h-px w-full max-w-[420px] bg-white/25" />

        <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <a
            ref={startRef}
            href="#about"
            data-testid="link-final-start-conversation"
            className="dclFinal__cta group inline-flex items-center gap-4 bg-[#c6e3fa] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-[background-color,box-shadow] duration-300 hover:bg-[#8bbfe8] hover:text-[#080a0d] hover:shadow-[0_8px_28px_rgba(139,191,232,.4)] focus:text-[#080a0d] focus-visible:text-[#080a0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] active:text-[#080a0d]"
          >
            Start a Conversation
            <ArrowUpRight size={15} strokeWidth={1.3} className="text-[#080a0d] transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
          </a>
          <a
            ref={exploreRef}
            href="#expertise"
            data-testid="link-final-explore-expertise"
            className="dclFinal__cta inline-flex items-center border-b border-white/45 px-1 py-4 text-[11px] font-semibold uppercase tracking-[.13em] text-white/80 transition-colors duration-300 hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
          >
            Explore Our Expertise
          </a>
        </div>

        <p className="dclFinal__cta mt-14 text-[11px] font-semibold uppercase tracking-[.15em] text-white/40">
          Independent perspective. Structured analysis. Clearer decisions.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @workspace/dcl-consulting test -- FinalCta`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/FinalCta.tsx src/components/sections/FinalCta.test.tsx
git commit -m "feat: add Final CTA section"
```

---

## Task 7: Wire into App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add the five new sections after Industries**

Add imports and render them in order, without touching the existing five:

```tsx
import { WhoWeAdvise } from '@/components/sections/WhoWeAdvise';
import { WhyDcl } from '@/components/sections/WhyDcl';
import { DclAtAGlance } from '@/components/sections/DclAtAGlance';
import { OurPhilosophy } from '@/components/sections/OurPhilosophy';
import { FinalCta } from '@/components/sections/FinalCta';
```

And in `Home`:

```tsx
function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Expertise />
      <Approach />
      <Industries />
      <WhoWeAdvise />
      <WhyDcl />
      <DclAtAGlance />
      <OurPhilosophy />
      <FinalCta />
    </main>
  );
}
```

- [ ] **Step 2: Run the full test suite**

Run: `pnpm --filter @workspace/dcl-consulting test`
Expected: PASS, all files green.

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter @workspace/dcl-consulting run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: wire the five new sections into App.tsx after Industries"
```

---

## Task 8: Manual verification

- [ ] Start/confirm the dev server is running and serving the new sections (check via curl or browser).
- [ ] Grep `src/components/sections` and `src/data` for em-dash characters and numbering patterns - expect zero matches outside test files' own regex definitions.
- [ ] Visually check at 1440/1280/1024/768/430/390/360px: no horizontal scroll, Our Philosophy's pin behaves correctly on desktop and is absent on mobile, Who We Advise / Why DCL fall back to fully-visible non-interactive content below 1024px.
- [ ] Verify reduced-motion emulation still renders every section in a legible final state.

## Self-review notes (completed during plan authoring)

- **Spec coverage:** every section in the design spec has a task; the eyebrow convention, no-numbering rule, and DCL at a Glance's "no invented facts" requirement are each covered by an explicit test.
- **Placeholder scan:** no TBD/TODO; every step has complete code.
- **Type consistency:** `AudienceItem`/`QualityItem`/`CompanyFact`/`PhilosophyStatement` field names match between `home-content.ts` and their consuming components. `getActiveIndex` and `useMagnetic` signatures match their existing definitions (no new signature introduced).
