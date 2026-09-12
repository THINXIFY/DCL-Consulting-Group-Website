# DCL Homepage First Five Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder Hero/About/Expertise/Approach/Industries implementation in `artifacts/dcl-consulting` with the premium, animated, numbering-free version described in `docs/superpowers/specs/2026-09-12-dcl-homepage-sections-design.md`.

**Architecture:** Split `App.tsx`'s inline sections into standalone components under `src/components/sections/`, back them with a numbering-free content data module and a small set of testable pure helpers, animate with GSAP + ScrollTrigger (entrance/parallax/scroll-progress) and plain React state + CSS transitions (hover/focus active-item crossfades), and cover the parts that are actually testable (content correctness, accessibility wiring, pure scroll-math) with Vitest + React Testing Library.

**Tech Stack:** React 19, Vite 7, Tailwind v4, GSAP (+ ScrollTrigger), Vitest, @testing-library/react.

---

## Notes for the implementer

- All work happens inside `artifacts/dcl-consulting/`. Paths below are relative to that directory unless stated otherwise.
- Images use `https://picsum.photos/seed/{seed}/{w}/{h}?grayscale` - deterministic, always resolves (no broken-link risk), and the `grayscale` query gives the consistent desaturated editorial treatment the design calls for. Do not use raw `images.unsplash.com/photo-<id>` URLs for new images - unverifiable IDs risk 404s.
- Accent color `#8BBFE8` is the only interactive/accent color (rules, focus rings, active states). `#C6E3FA` is tint/highlight only, never interactive. Radius is `0` everywhere - do not add rounded corners anywhere.
- No section has more than one small-caps "eyebrow" label across the whole page except the Hero. Do not add one to About, Expertise, Approach, or Industries.
- Zero em-dash (`—`) or en-dash-as-separator (`–`) characters anywhere in copy. Use a hyphen or restructure the sentence.
- Every hover-driven interaction (Expertise, Industries) must also fire on keyboard focus, via matching `onFocus`/`onBlur` handlers next to `onMouseEnter`/`onMouseLeave`.
- Sticky/pin/hover-index behavior is desktop-only (`>= 1024px`). Gate it with a `useMediaQuery('(min-width: 1024px)')` check (Task 3) so mobile renders the plain fallback markup instead.

---

## Task 1: Test tooling (Vitest + React Testing Library)

**Files:**
- Modify: `package.json` (add devDependencies + `test` script)
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/test/smoke.test.ts`

- [ ] **Step 1: Add test dependencies**

Edit `package.json` `devDependencies` to add:

```json
    "vitest": "^3.2.4",
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^25.0.1",
```

- [ ] **Step 2: Add the `test` script**

In `package.json` `scripts`, add:

```json
    "test": "vitest run",
```

- [ ] **Step 3: Install**

Run: `pnpm install` (from the repo root, so the workspace lockfile updates)
Expected: install completes, no errors.

- [ ] **Step 4: Create the Vitest config**

Create `vitest.config.ts` (standalone - do NOT import `vite.config.ts`, which throws if `PORT`/`BASE_PATH` env vars are unset):

```ts
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: false,
  },
});
```

- [ ] **Step 5: Create the test setup file**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 6: Write a smoke test**

Create `src/test/smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

describe('vitest setup', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 7: Run it**

Run: `pnpm --filter @workspace/dcl-consulting test`
Expected: 1 test file, 1 test, PASS.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts src/test/setup.ts src/test/smoke.test.ts
git commit -m "test: add vitest + testing-library to dcl-consulting"
```

---

## Task 2: Content data module

**Files:**
- Create: `src/data/home-content.ts`
- Test: `src/data/home-content.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/data/home-content.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { approach, expertise, industries } from './home-content';

const NUMBERING_PATTERN = /\b(0?[1-9]|1[0-2])\s*[/.)-]/;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(allStrings);
  }
  return [];
}

describe('home-content', () => {
  it('has six expertise items with no numbering fields', () => {
    expect(expertise).toHaveLength(6);
    for (const item of expertise) {
      expect(item).not.toHaveProperty('number');
      expect(item.title).toBeTruthy();
      expect(item.copy).toBeTruthy();
      expect(item.image).toMatch(/^https:\/\/picsum\.photos\/seed\//);
    }
  });

  it('has five approach stages with no numbering fields', () => {
    expect(approach).toHaveLength(5);
    for (const stage of approach) {
      expect(stage).not.toHaveProperty('number');
      expect(stage.title).toBeTruthy();
      expect(stage.copy).toBeTruthy();
    }
  });

  it('has twelve industries with no numbering fields', () => {
    expect(industries).toHaveLength(12);
    for (const item of industries) {
      expect(item).not.toHaveProperty('number');
      expect(item.name).toBeTruthy();
      expect(item.context).toBeTruthy();
      expect(item.image).toMatch(/^https:\/\/picsum\.photos\/seed\//);
    }
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    const strings = [...allStrings(expertise), ...allStrings(approach), ...allStrings(industries)];
    for (const s of strings) {
      expect(s).not.toMatch(NUMBERING_PATTERN);
      expect(s).not.toMatch(DASH_CHARS);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @workspace/dcl-consulting test -- home-content`
Expected: FAIL - `Cannot find module './home-content'`.

- [ ] **Step 3: Write the content module**

Create `src/data/home-content.ts`:

```ts
export interface ExpertiseItem {
  title: string;
  category: string;
  copy: string;
  image: string;
}

export interface ApproachStage {
  title: string;
  copy: string;
}

export interface IndustryItem {
  name: string;
  context: string;
  image: string;
}

const img = (seed: string, w = 1400, h = 1000) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}?grayscale`;

export const expertise: ExpertiseItem[] = [
  {
    title: 'Investment Consulting',
    category: 'Decision support',
    copy: 'Strategic guidance for evaluating opportunities and identifying the factors that should influence an investment decision.',
    image: img('dcl-exp-investment'),
  },
  {
    title: 'Opportunity Analysis',
    category: 'Commercial context',
    copy: 'Structured assessment of the business, market, and underlying potential behind an opportunity.',
    image: img('dcl-exp-opportunity'),
  },
  {
    title: 'Risk & Opportunity Assessment',
    category: 'Material considerations',
    copy: 'Balanced consideration of material risks, assumptions, dependencies, and potential upside.',
    image: img('dcl-exp-risk'),
  },
  {
    title: 'Business & Financial Analysis',
    category: 'Performance review',
    copy: 'Review of business performance, economics, and relevant financial factors.',
    image: img('dcl-exp-financial'),
  },
  {
    title: 'Strategic Advisory',
    category: 'Commercial direction',
    copy: 'Independent perspective on strategic decisions, growth opportunities, and commercial direction.',
    image: img('dcl-exp-strategy'),
  },
  {
    title: 'Due Diligence Support',
    category: 'Decision readiness',
    copy: 'Organised review of important information, assumptions, and unresolved questions before a significant decision.',
    image: img('dcl-exp-diligence'),
  },
];

export const approach: ApproachStage[] = [
  { title: 'Understand', copy: 'Establish the opportunity, objective, and wider context.' },
  { title: 'Analyse', copy: 'Review the business, market, economics, and relevant information.' },
  { title: 'Challenge', copy: 'Test assumptions, dependencies, and areas of uncertainty.' },
  { title: 'Assess', copy: 'Bring risk, opportunity, and strategic considerations together.' },
  { title: 'Advise', copy: 'Translate the analysis into clear, decision relevant perspective.' },
];

export const industries: IndustryItem[] = [
  { name: 'Real Estate', context: 'Property, development, and asset backed opportunities.', image: img('dcl-ind-realestate') },
  { name: 'Technology', context: 'Technology enabled businesses and digital growth opportunities.', image: img('dcl-ind-technology') },
  { name: 'Artificial Intelligence', context: 'Emerging capabilities, applications, and business models.', image: img('dcl-ind-ai') },
  { name: 'Healthcare', context: 'Healthcare services and health related businesses.', image: img('dcl-ind-healthcare') },
  { name: 'Pharmaceuticals', context: 'Products, platforms, and commercial life sciences.', image: img('dcl-ind-pharma') },
  { name: 'Financial Services', context: 'Financial institutions, platforms, and enabling infrastructure.', image: img('dcl-ind-financial') },
  { name: 'Consumer & Retail', context: 'Consumer behaviour, brands, and distribution models.', image: img('dcl-ind-consumer') },
  { name: 'Energy', context: 'Energy businesses and the transition around them.', image: img('dcl-ind-energy') },
  { name: 'Infrastructure', context: 'Essential networks, assets, and long term investment.', image: img('dcl-ind-infrastructure') },
  { name: 'Industrial', context: 'Industrial businesses, products, and operating models.', image: img('dcl-ind-industrial') },
  { name: 'Hospitality', context: 'Experiences, property, and service led businesses.', image: img('dcl-ind-hospitality') },
  { name: 'Professional Services', context: 'Knowledge businesses and specialist operators.', image: img('dcl-ind-professional') },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @workspace/dcl-consulting test -- home-content`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/data/home-content.ts src/data/home-content.test.ts
git commit -m "feat: add numbering-free home content data module"
```

---

## Task 3: Shared helpers (GSAP registration, reduced motion, media query, scroll-active-index)

**Files:**
- Create: `src/lib/gsap.ts`
- Create: `src/lib/scroll-active-index.ts`
- Test: `src/lib/scroll-active-index.test.ts`
- Create: `src/hooks/use-media-query.ts`
- Test: `src/hooks/use-media-query.test.tsx`

- [ ] **Step 1: GSAP registration module**

Create `src/lib/gsap.ts`:

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function ensureGsapRegistered() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
```

- [ ] **Step 2: Write the failing test for the pure scroll-active-index helper**

Create `src/lib/scroll-active-index.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getActiveIndex } from './scroll-active-index';

describe('getActiveIndex', () => {
  it('returns 0 at progress 0', () => {
    expect(getActiveIndex(0, 5)).toBe(0);
  });

  it('returns the last index at progress 1', () => {
    expect(getActiveIndex(1, 5)).toBe(4);
  });

  it('returns the middle index at progress 0.5 for 5 items', () => {
    expect(getActiveIndex(0.5, 5)).toBe(2);
  });

  it('clamps out-of-range progress', () => {
    expect(getActiveIndex(-1, 5)).toBe(0);
    expect(getActiveIndex(2, 5)).toBe(4);
  });

  it('never returns an index outside the array bounds', () => {
    for (let p = 0; p <= 1; p += 0.05) {
      const idx = getActiveIndex(p, 5);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(5);
    }
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm --filter @workspace/dcl-consulting test -- scroll-active-index`
Expected: FAIL - module not found.

- [ ] **Step 4: Implement the pure helper**

Create `src/lib/scroll-active-index.ts`:

```ts
/**
 * Maps a 0..1 scroll progress value to an active index in a list of
 * `count` items, evenly dividing progress into `count` buckets.
 */
export function getActiveIndex(progress: number, count: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.min(count - 1, Math.floor(clamped * count));
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter @workspace/dcl-consulting test -- scroll-active-index`
Expected: PASS, 5 tests.

- [ ] **Step 6: Write the failing test for the media query hook**

Create `src/hooks/use-media-query.test.tsx`:

```tsx
import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useMediaQuery } from './use-media-query';

function mockMatchMedia(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.push(cb),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
  return listeners;
}

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the initial match state', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(true);
  });

  it('returns false when the query does not match', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(false);
  });
});
```

- [ ] **Step 7: Run test to verify it fails**

Run: `pnpm --filter @workspace/dcl-consulting test -- use-media-query`
Expected: FAIL - module not found.

- [ ] **Step 8: Implement the hook**

Create `src/hooks/use-media-query.ts`:

```ts
import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
```

- [ ] **Step 9: Run test to verify it passes**

Run: `pnpm --filter @workspace/dcl-consulting test -- use-media-query`
Expected: PASS, 2 tests.

- [ ] **Step 10: Commit**

```bash
git add src/lib/gsap.ts src/lib/scroll-active-index.ts src/lib/scroll-active-index.test.ts src/hooks/use-media-query.ts src/hooks/use-media-query.test.tsx
git commit -m "feat: add gsap registration, scroll-active-index, and useMediaQuery helpers"
```

---

## Task 4: Header component (extracted, numbering-free)

**Files:**
- Create: `src/components/Header.tsx`
- Test: `src/components/Header.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/Header.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('renders the primary nav links with no numbering', () => {
    render(<Header />);
    for (const label of ['About us', 'Our expertise', 'Our approach', 'Industries']) {
      const link = screen.getByTestId(`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`);
      expect(link).toHaveTextContent(label);
      expect(link.textContent).not.toMatch(/\d/);
    }
  });

  it('toggles the mobile menu on click', () => {
    render(<Header />);
    const button = screen.getByTestId('button-mobile-menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('link-mobile-about-us')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @workspace/dcl-consulting test -- Header`
Expected: FAIL - module not found.

- [ ] **Step 3: Implement the Header**

Create `src/components/Header.tsx` (extracted from the old `App.tsx`, same behavior, no numbering was present here so content is unchanged):

```tsx
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

function Mark() {
  return (
    <span className="flex items-center gap-3" aria-label="DCL Consulting and Investments Limited">
      <span className="flex h-8 w-8 items-center justify-center border border-[#8bbfe8] text-[12px] font-bold tracking-[-.08em] text-[#8bbfe8]">DCL</span>
      <span className="hidden text-[11px] font-semibold uppercase leading-[1.1] tracking-[.17em] text-white sm:block">DCL Consulting<br />& Investments</span>
    </span>
  );
}

const NAV_LINKS: Array<[string, string]> = [
  ['About us', '#about'],
  ['Our expertise', '#expertise'],
  ['Our approach', '#approach'],
  ['Industries', '#industries'],
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
        <a href="#top" data-testid="link-home"><Mark /></a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
              className="text-[11px] font-medium uppercase tracking-[.12em] text-white/70 transition-colors hover:text-[#c6e3fa] focus-visible:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#about"
          data-testid="link-start-conversation"
          className="hidden border-b border-[#8bbfe8] pb-1 text-[11px] font-semibold uppercase tracking-[.15em] text-white transition-colors hover:text-[#c6e3fa] focus-visible:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] sm:block"
        >
          Start a conversation
        </a>
        <button
          type="button"
          data-testid="button-mobile-menu"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8] md:hidden"
        >
          {open ? <X size={21} strokeWidth={1.5} /> : <Menu size={21} strokeWidth={1.5} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-white/10 bg-[#080a0d]/95 px-6 py-5 md:hidden" aria-label="Mobile navigation">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}
              className="block border-b border-white/10 py-4 text-[11px] font-medium uppercase tracking-[.14em] text-white/80"
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @workspace/dcl-consulting test -- Header`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx src/components/Header.test.tsx
git commit -m "feat: extract Header component"
```

---

## Task 5: Hero section

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Test: `src/components/sections/Hero.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/sections/Hero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders exactly one eyebrow, the two-line headline, and both CTAs', () => {
    render(<Hero />);
    const section = screen.getByRole('region', { name: /clarity/i });
    expect(section).toHaveAttribute('id', 'top');

    expect(screen.getByTestId('text-hero-eyebrow')).toBeInTheDocument();
    expect(screen.getByTestId('text-hero-title')).toHaveTextContent(/clarity/i);
    expect(screen.getByTestId('text-hero-title')).toHaveTextContent(/before capital/i);

    expect(screen.getByTestId('link-explore-expertise')).toHaveTextContent('Explore Our Expertise');
    expect(screen.getByTestId('link-start-conversation-hero')).toHaveTextContent('Start a Conversation');
  });

  it('has no more than four text elements in the hero stack (eyebrow, headline, subtext, CTAs)', () => {
    render(<Hero />);
    expect(screen.queryByTestId('text-hero-tagline-strip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('link-explore-about')).not.toBeInTheDocument();
  });

  it('contains no em-dash characters in visible copy', () => {
    render(<Hero />);
    const section = screen.getByRole('region', { name: /clarity/i });
    expect(section.textContent).not.toMatch(/[–—]/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @workspace/dcl-consulting test -- sections/Hero`
Expected: FAIL - module not found.

- [ ] **Step 3: Implement the Hero section**

Create `src/components/sections/Hero.tsx`:

```tsx
import { useEffect, useRef } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const HERO_IMAGE = 'https://picsum.photos/seed/dcl-hero-facade/1600/2000?grayscale';

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclHero__reveal', '.dclHero__image', '.dclHero__imageWrap'], { clearProps: 'all' });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        '.dclHero__imageWrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.1 },
      )
        .fromTo('.dclHero__revealLine', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.12 }, 0.1)
        .fromTo('.dclHero__reveal--sub', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo('.dclHero__reveal--cta', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.4');

      gsap.to('.dclHero__image', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="top"
      ref={rootRef}
      role="region"
      aria-label="Clarity before capital"
      className="relative min-h-[100dvh] overflow-hidden bg-[#080a0d] text-white"
    >
      <Header />
      <div className="relative mx-auto grid min-h-[100dvh] max-w-[1440px] grid-cols-1 items-center gap-10 px-6 pb-16 pt-24 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-16">
        <div className="max-w-[620px]">
          <p data-testid="text-hero-eyebrow" className="dclHome__eyebrow dclHero__reveal dclHero__revealLine mb-7 overflow-hidden text-[#c6e3fa]">
            Independent insight. London and international.
          </p>
          <h1
            id="hero-title"
            data-testid="text-hero-title"
            className="dclHome__display text-[clamp(3.2rem,7vw,6.2rem)] leading-[.95] tracking-[-.04em]"
          >
            <span className="block overflow-hidden"><span className="dclHero__revealLine block">Clarity</span></span>
            <span className="block overflow-hidden"><span className="dclHero__revealLine block text-[#c6e3fa]">Before Capital.</span></span>
          </h1>
          <p className="dclHero__reveal dclHero__reveal--sub mt-8 max-w-[480px] text-[16px] leading-7 text-white/70 sm:text-[18px]">
            DCL Consulting helps investors evaluate opportunities with greater clarity through disciplined analysis, strategic insight, and independent perspective.
          </p>
          <div className="mt-9 flex flex-wrap gap-5">
            <a
              href="#expertise"
              data-testid="link-explore-expertise"
              className="dclHero__reveal dclHero__reveal--cta dclMagnetic group inline-flex items-center gap-4 bg-[#c6e3fa] px-5 py-3 text-[11px] font-semibold uppercase tracking-[.13em] text-[#080a0d] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              Explore Our Expertise
              <ArrowDownRight size={15} strokeWidth={1.3} className="transition-transform group-hover:translate-y-1" />
            </a>
            <a
              href="#about"
              data-testid="link-start-conversation-hero"
              className="dclHero__reveal dclHero__reveal--cta dclMagnetic inline-flex items-center border-b border-white/45 px-1 py-3 text-[11px] font-semibold uppercase tracking-[.13em] text-white/80 transition-colors hover:border-[#c6e3fa] hover:text-[#c6e3fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
            >
              Start a Conversation
            </a>
          </div>
        </div>
        <div className="dclHero__imageWrap relative aspect-[4/5] w-full overflow-hidden lg:aspect-auto lg:h-full">
          <img
            className="dclHero__image h-full w-full scale-110 object-cover"
            src={HERO_IMAGE}
            alt="Modern architectural facade with strong geometric lines"
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,10,13,.55)_0%,transparent_45%)]" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @workspace/dcl-consulting test -- sections/Hero`
Expected: PASS, 3 tests. (GSAP/ScrollTrigger run against jsdom without throwing since `gsap.context` only registers tweens; no layout assertions are made in the test.)

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/sections/Hero.test.tsx
git commit -m "feat: add redesigned Hero section"
```

---

## Task 6: About section

**Files:**
- Create: `src/components/sections/About.tsx`
- Test: `src/components/sections/About.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/sections/About.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { About } from './About';

describe('About', () => {
  it('renders the headline and company facts with no eyebrow label', () => {
    render(<About />);
    const section = document.getElementById('about');
    expect(section).not.toBeNull();
    expect(screen.getByTestId('text-about-title')).toHaveTextContent(/clarity begins with understanding/i);
    expect(screen.getByText('Company no. 10086906')).toBeInTheDocument();
    expect(section?.querySelector('.dclHome__eyebrow')).toBeNull();
  });

  it('contains no em-dash characters', () => {
    render(<About />);
    const section = document.getElementById('about');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @workspace/dcl-consulting test -- sections/About`
Expected: FAIL - module not found.

- [ ] **Step 3: Implement the About section**

Create `src/components/sections/About.tsx`:

```tsx
import { useEffect, useRef } from 'react';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

const ABOUT_IMAGE = 'https://picsum.photos/seed/dcl-about-office/1200/1400?grayscale';

const FACTS = [
  'DCL Consulting and Investments Limited',
  'Private limited company',
  'Registered in England and Wales',
  'Company no. 10086906',
];

const BODY = [
  'DCL Consulting and Investments Limited provides independent investment consulting and strategic decision support.',
  'We help investors and businesses understand opportunities more clearly by examining commercial fundamentals, financial considerations, material risks, and strategic context.',
  'Our role is to bring shape to the uncertain. We combine rigorous research with commercial understanding to reveal what matters, what is missing, and what should happen next.',
  "Quietly independent and deliberately close to the work, we operate as a trusted extension of our clients' thinking.",
];

export function About() {
  const rootRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!rootRef.current) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.dclAbout__rule', '.dclAbout__fadeUp', '.dclAbout__imageWrap'], { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        '.dclAbout__rule',
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
        },
      );

      gsap.utils.toArray<HTMLElement>('.dclAbout__fadeUp').forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.05,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        );
      });

      gsap.fromTo(
        '.dclAbout__imageWrap',
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.dclAbout__imageWrap', start: 'top 75%' },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="about" ref={rootRef} aria-labelledby="about-title" className="bg-[#f2f4f6] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <h2 id="about-title" data-testid="text-about-title" className="dclHome__display dclAbout__fadeUp max-w-[820px] text-[clamp(2.6rem,5.4vw,5.4rem)] leading-[.95] tracking-[-.04em] text-[#080a0d]">
          Clarity begins with understanding.
        </h2>
        <div className="mt-16 grid gap-16 lg:grid-cols-[.62fr_1.38fr] lg:gap-24">
          <div className={isDesktop ? 'lg:sticky lg:top-24 lg:self-start' : undefined}>
            <p className="dclAbout__fadeUp max-w-[260px] text-[15px] leading-6 text-[#6b737a]">
              A considered perspective, for decisions that deserve one.
            </p>
            <div className="dclAbout__rule mt-8 h-px w-16 bg-[#8bbfe8]" />
            <div className="dclAbout__fadeUp mt-8 border-t border-[#080a0d]/20 pt-5 text-[10px] font-semibold uppercase leading-5 tracking-[.13em] text-[#6b737a]">
              {FACTS.map((fact) => (
                <p key={fact}>{fact}</p>
              ))}
            </div>
          </div>
          <div className="grid gap-10 sm:grid-cols-[1fr_1fr]">
            <div className="space-y-5">
              {BODY.map((paragraph) => (
                <p key={paragraph} className="dclAbout__fadeUp max-w-[420px] text-[16px] leading-7 text-[#171714] sm:text-[17px]">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="dclAbout__imageWrap aspect-[4/5] w-full overflow-hidden">
              <img className="h-full w-full object-cover" src={ABOUT_IMAGE} alt="Quietly lit contemporary office interior with long architectural lines" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @workspace/dcl-consulting test -- sections/About`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/About.tsx src/components/sections/About.test.tsx
git commit -m "feat: add redesigned About section"
```

---

## Task 7: Expertise section

**Files:**
- Create: `src/components/sections/Expertise.tsx`
- Test: `src/components/sections/Expertise.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/sections/Expertise.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Expertise } from './Expertise';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('Expertise', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders all six services with no numbering', () => {
    mockDesktop(true);
    render(<Expertise />);
    for (const title of [
      'Investment Consulting',
      'Opportunity Analysis',
      'Risk & Opportunity Assessment',
      'Business & Financial Analysis',
      'Strategic Advisory',
      'Due Diligence Support',
    ]) {
      const row = screen.getByTestId(`row-expertise-${title.toLowerCase().replaceAll(/[^a-z]+/g, '-')}`);
      expect(row).toHaveTextContent(title);
    }
    expect(screen.queryByText(/^0[1-6]$/)).not.toBeInTheDocument();
  });

  it('marks a row active on focus (desktop)', () => {
    mockDesktop(true);
    render(<Expertise />);
    const row = screen.getByTestId('row-expertise-investment-consulting');
    fireEvent.focus(row);
    expect(row).toHaveAttribute('data-active', 'true');
    fireEvent.blur(row);
    expect(row).toHaveAttribute('data-active', 'false');
  });

  it('renders an accessible accordion on mobile', () => {
    mockDesktop(false);
    render(<Expertise />);
    const trigger = screen.getByTestId('button-expertise-investment-consulting');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @workspace/dcl-consulting test -- sections/Expertise`
Expected: FAIL - module not found.

- [ ] **Step 3: Implement the Expertise section**

Create `src/components/sections/Expertise.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { expertise } from '@/data/home-content';
import { ensureGsapRegistered, gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(title: string) {
  return title.toLowerCase().replaceAll(/[^a-z]+/g, '-').replace(/(^-|-$)/g, '');
}

export function Expertise() {
  const rootRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(null);

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion) return;
    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dclExpertise__row',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="expertise" ref={rootRef} aria-labelledby="expertise-title" className="bg-[#171714] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <h2 id="expertise-title" className="dclHome__display max-w-[650px] text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[.92] tracking-[-.04em]">
            Expertise applied to <em className="text-[#c6e3fa] not-italic">the decision.</em>
          </h2>
          <p className="max-w-[260px] text-[14px] leading-6 text-white/48">
            Independent perspective across the decisions that shape businesses, portfolios, and markets.
          </p>
        </div>

        {isDesktop ? (
          <div
            className="grid gap-14 border-t border-white/20 lg:grid-cols-[1.3fr_1fr]"
            onMouseLeave={() => setActiveIndex(0)}
          >
            <div>
              {expertise.map((item, index) => {
                const active = activeIndex === index;
                return (
                  <article
                    key={item.title}
                    data-testid={`row-expertise-${slug(item.title)}`}
                    data-active={active}
                    tabIndex={0}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onBlur={() => setActiveIndex(0)}
                    className="dclExpertise__row group grid cursor-default grid-cols-[1.1fr_.8fr] items-center gap-6 border-b border-white/20 py-8 outline-none transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                    style={{ opacity: active || activeIndex === null ? 1 : 0.4 }}
                  >
                    <div>
                      <h3 className="dclHome__display text-[clamp(1.8rem,2.8vw,2.9rem)] leading-[.95] tracking-[-.03em]">{item.title}</h3>
                      <span
                        className="mt-3 block h-px bg-[#8bbfe8] transition-transform duration-500"
                        style={{ transform: `scaleX(${active ? 1 : 0})`, transformOrigin: 'left center', width: '96px' }}
                      />
                    </div>
                    <div>
                      <p className="dclHome__eyebrow mb-2 text-white/40">{item.category}</p>
                      <p className="max-w-[340px] text-[15px] leading-6 text-white/60">{item.copy}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="relative hidden aspect-[4/5] w-full overflow-hidden lg:block">
              {expertise.map((item, index) => (
                <img
                  key={item.title}
                  src={item.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                  style={{ opacity: activeIndex === index ? 1 : 0 }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="border-t border-white/20">
            {expertise.map((item) => {
              const isOpen = openMobile === expertise.indexOf(item);
              const index = expertise.indexOf(item);
              return (
                <div key={item.title} className="border-b border-white/20">
                  <button
                    type="button"
                    data-testid={`button-expertise-${slug(item.title)}`}
                    aria-expanded={isOpen}
                    onClick={() => setOpenMobile(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8bbfe8]"
                  >
                    <span className="dclHome__display text-[1.7rem] leading-none tracking-[-.03em]">{item.title}</span>
                    <ChevronDown size={18} strokeWidth={1.3} className={`shrink-0 text-[#8bbfe8] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden text-[14px] leading-6 text-white/60 transition-all duration-500 ${isOpen ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {item.copy}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @workspace/dcl-consulting test -- sections/Expertise`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Expertise.tsx src/components/sections/Expertise.test.tsx
git commit -m "feat: add redesigned Expertise section"
```

---

## Task 8: Approach section

**Files:**
- Create: `src/components/sections/Approach.tsx`
- Test: `src/components/sections/Approach.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/sections/Approach.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Approach } from './Approach';

describe('Approach', () => {
  it('renders all five stages with no numbering and no eyebrow', () => {
    render(<Approach />);
    const section = document.getElementById('approach');
    for (const title of ['Understand', 'Analyse', 'Challenge', 'Assess', 'Advise']) {
      expect(screen.getByTestId(`text-stage-${title.toLowerCase()}`)).toHaveTextContent(title);
    }
    expect(section?.querySelector('.dclHome__eyebrow')).toBeNull();
  });

  it('marks the first stage active by default', () => {
    render(<Approach />);
    expect(screen.getByTestId('text-stage-understand')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('text-stage-advise')).toHaveAttribute('data-active', 'false');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @workspace/dcl-consulting test -- sections/Approach`
Expected: FAIL - module not found.

- [ ] **Step 3: Implement the Approach section**

Create `src/components/sections/Approach.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react';
import { approach } from '@/data/home-content';
import { ensureGsapRegistered, gsap, ScrollTrigger } from '@/lib/gsap';
import { getActiveIndex } from '@/lib/scroll-active-index';
import { useMediaQuery } from '@/hooks/use-media-query';

export function Approach() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!rootRef.current || !listRef.current || !isDesktop || prefersReducedMotion) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: listRef.current,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => setActiveIndex(getActiveIndex(self.progress, approach.length)),
      });

      gsap.fromTo(
        '.dclApproach__progressRule',
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: { trigger: listRef.current, start: 'top center', end: 'bottom center', scrub: true },
        },
      );

      return () => trigger.kill();
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, prefersReducedMotion]);

  return (
    <section
      id="approach"
      ref={rootRef}
      aria-labelledby="approach-title"
      className="px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40"
      style={{ backgroundColor: '#edeef0' }}
    >
      <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[.85fr_1.4fr] lg:gap-28">
        <div className={isDesktop ? 'lg:sticky lg:top-24 lg:self-start' : undefined}>
          <h2 id="approach-title" className="dclHome__display max-w-[430px] text-[clamp(2.6rem,5.4vw,5.2rem)] leading-[.93] tracking-[-.04em] text-[#080a0d]">
            From information to informed judgement.
          </h2>
          <p className="mt-8 max-w-[320px] text-[16px] leading-7 text-[#35536a]">
            We make the complex legible: a process designed to move from the right question to a decision you can stand behind.
          </p>
        </div>
        <div ref={listRef} className="relative border-l border-[#080a0d]/15 pl-10">
          <div className="dclApproach__progressRule absolute left-0 top-0 h-full w-px bg-[#8bbfe8]" />
          <div className="flex flex-col gap-14">
            {approach.map((stage, index) => {
              const active = isDesktop ? activeIndex === index : true;
              return (
                <div
                  key={stage.title}
                  data-testid={`text-stage-${stage.title.toLowerCase()}`}
                  data-active={active}
                  className="transition-opacity duration-500"
                  style={{ opacity: active ? 1 : 0.35 }}
                >
                  <h3 className="dclHome__display text-[clamp(2rem,4vw,3.4rem)] leading-none tracking-[-.03em] text-[#080a0d]">{stage.title}</h3>
                  <p className="mt-3 max-w-[420px] text-[15px] leading-6 text-[#35536a]">{stage.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @workspace/dcl-consulting test -- sections/Approach`
Expected: PASS, 2 tests. (`isDesktop` defaults to `false` under jsdom's default matchMedia mock unless a test mocks it, so every stage renders `data-active="true"`, matching the mobile fallback described in the spec; the "first stage active by default" test relies on desktop mode being unmocked and `activeIndex` initial state `0`, which holds regardless of `isDesktop`.)

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Approach.tsx src/components/sections/Approach.test.tsx
git commit -m "feat: add redesigned Approach section"
```

---

## Task 9: Industries section

**Files:**
- Create: `src/components/sections/Industries.tsx`
- Test: `src/components/sections/Industries.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/sections/Industries.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Industries } from './Industries';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('Industries', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders all twelve industries with no numbering', () => {
    mockDesktop(true);
    render(<Industries />);
    expect(screen.getAllByTestId(/^item-industry-/)).toHaveLength(12);
    expect(screen.queryByText(/^0?[1-9][/.)-]/)).not.toBeInTheDocument();
  });

  it('updates the active industry and context copy on focus (desktop)', () => {
    mockDesktop(true);
    render(<Industries />);
    const secondItem = screen.getByTestId('item-industry-technology');
    fireEvent.focus(secondItem);
    expect(secondItem).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('text-industry-context')).toHaveTextContent(/technology enabled/i);
  });

  it('renders a plain list with no sticky image on mobile', () => {
    mockDesktop(false);
    render(<Industries />);
    expect(screen.queryByTestId('image-industry-sticky')).not.toBeInTheDocument();
    expect(screen.getAllByTestId(/^item-industry-/)).toHaveLength(12);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @workspace/dcl-consulting test -- sections/Industries`
Expected: FAIL - module not found.

- [ ] **Step 3: Implement the Industries section**

Create `src/components/sections/Industries.tsx`:

```tsx
import { useState } from 'react';
import { industries } from '@/data/home-content';
import { useMediaQuery } from '@/hooks/use-media-query';

function slug(name: string) {
  return name.toLowerCase().replaceAll(/[^a-z]+/g, '-').replace(/(^-|-$)/g, '');
}

export function Industries() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [activeIndex, setActiveIndex] = useState(0);
  const active = industries[activeIndex];

  return (
    <section id="industries" aria-labelledby="industries-title" className="bg-[#080a0d] px-6 py-24 text-white sm:px-10 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <h2 id="industries-title" className="dclHome__display max-w-[760px] text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[.92] tracking-[-.04em]">
          Perspective across <em className="text-[#c6e3fa] not-italic">different sectors.</em>
        </h2>
        <p className="mt-6 max-w-[520px] text-[16px] leading-7 text-white/58">
          DCL's evaluation is driven by the fundamentals of the opportunity rather than a fixed sector template.
        </p>

        <div className="mt-16 grid gap-14 border-t border-white/20 pt-14 lg:grid-cols-[.75fr_1.25fr]">
          {isDesktop && (
            <div data-testid="image-industry-sticky" className="relative aspect-[4/5] w-full self-start overflow-hidden lg:sticky lg:top-24">
              {industries.map((item, index) => (
                <img
                  key={item.name}
                  src={item.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                  style={{ opacity: activeIndex === index ? 1 : 0 }}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#080a0d] to-transparent p-8">
                <p data-testid="text-industry-context" className="max-w-[360px] text-[14px] leading-6 text-white/75">
                  {active.context}
                </p>
              </div>
            </div>
          )}
          <div>
            {industries.map((item, index) => {
              const isActive = isDesktop ? activeIndex === index : true;
              return (
                <div
                  key={item.name}
                  data-testid={`item-industry-${slug(item.name)}`}
                  data-active={isActive}
                  tabIndex={isDesktop ? 0 : undefined}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  className="border-b border-white/20 py-6 outline-none transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-[#8bbfe8]"
                  style={{ opacity: isActive ? 1 : 0.4 }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[16px] font-medium sm:text-[18px]">{item.name}</span>
                    <span
                      className="h-px bg-[#8bbfe8] transition-transform duration-400"
                      style={{ width: '48px', transform: `scaleX(${isActive ? 1 : 0})`, transformOrigin: 'left center' }}
                    />
                  </div>
                  {!isDesktop && <p className="mt-2 text-[14px] leading-5 text-white/50">{item.context}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @workspace/dcl-consulting test -- sections/Industries`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Industries.tsx src/components/sections/Industries.test.tsx
git commit -m "feat: add redesigned Industries section"
```

---

## Task 10: Global CSS additions

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add focus-visible and reduced-motion safeguards**

Read `src/index.css` first, then append this block at the end of the file:

```css
:focus-visible {
  outline: 2px solid #8bbfe8;
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Verify no build errors**

Run: `pnpm --filter @workspace/dcl-consulting run typecheck`
Expected: PASS, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "style: add focus-visible ring and reduced-motion safeguard"
```

---

## Task 11: Wire sections into App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace the inline section implementations**

Read `src/App.tsx` first (current inline `Header`, `Hero`, `About`, `Expertise`, `Approach`, `Industries`, `Mark` functions and the `expertise`/`approach`/`industries` data arrays defined at the top of the file). Remove all of it and replace with imports from the new modules, keeping `Home`, `Router`, `RoutedErrorBoundary`, and `App` unchanged:

```tsx
import { type ReactNode } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Expertise } from '@/components/sections/Expertise';
import { Approach } from '@/components/sections/Approach';
import { Industries } from '@/components/sections/Industries';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Expertise />
      <Approach />
      <Industries />
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
```

- [ ] **Step 2: Run the full test suite**

Run: `pnpm --filter @workspace/dcl-consulting test`
Expected: PASS, all test files green.

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter @workspace/dcl-consulting run typecheck`
Expected: PASS, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: wire redesigned sections into App.tsx"
```

---

## Task 12: Manual verification and copy audit

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

From the repo root:
```bash
MSYS_NO_PATHCONV=1 PORT=5173 BASE_PATH=/ pnpm --filter @workspace/dcl-consulting run dev
```
(Kill anything already bound to port 5173 first if the port is in use.)

- [ ] **Step 2: Grep for banned characters and numbering across the new source**

Run:
```bash
grep -rn $'[–—]' artifacts/dcl-consulting/src/components artifacts/dcl-consulting/src/data
grep -rnE "0[1-9] ?[/.)-]" artifacts/dcl-consulting/src/components artifacts/dcl-consulting/src/data
```
Expected: no matches for either command.

- [ ] **Step 3: Visually verify in a browser at each required breakpoint**

Open `http://localhost:5173/` and resize (or use device toolbar) to 1440, 1280, 1024, 768, 430, 390, 360px. Confirm for each:
- No horizontal scrollbar appears.
- Hero fits without needing to scroll to see the CTAs.
- Sticky/hover behaviors (About facts column, Approach left column and progress rule, Expertise row hover, Industries sticky image) are present at >=1024px and gracefully replaced by the stacked/accordion/list fallback below 1024px.
- Focus-visible rings appear when tabbing through nav links, CTAs, Expertise rows/accordion buttons, and Industries items.

- [ ] **Step 4: Verify reduced motion**

In the browser devtools, enable "Emulate CSS prefers-reduced-motion: reduce" (Chrome DevTools > Rendering tab), reload, and confirm the page renders in its final state immediately with no parallax/clip/stagger animation and no layout breakage.

- [ ] **Step 5: Run the full test suite and typecheck one more time**

```bash
pnpm --filter @workspace/dcl-consulting test
pnpm --filter @workspace/dcl-consulting run typecheck
```
Expected: both PASS.

---

## Self-review notes (completed during plan authoring)

- **Spec coverage:** every section in the design spec (Hero, About, Expertise, Approach, Industries) has a task; the eyebrow budget, color/shape locks, em-dash ban, accessibility (focus parity, reduced motion), and responsive breakpoints are each covered by an explicit test or an explicit manual-verification step in Task 12.
- **Placeholder scan:** no TBD/TODO markers; every step has complete, runnable code.
- **Type consistency:** `ExpertiseItem`/`ApproachStage`/`IndustryItem` field names (`title`/`copy`/`image`, `title`/`copy`, `name`/`context`/`image`) are used identically in `home-content.ts` and in `Expertise.tsx`/`Approach.tsx`/`Industries.tsx`. `getActiveIndex(progress, count)` signature matches its one call site in `Approach.tsx`. `useMediaQuery(query)` signature matches all call sites.
