# DCL Consulting Homepage: First Five Sections Redesign

Date: 2026-09-12
Scope: `artifacts/dcl-consulting` (React + Vite + Tailwind v4)

## Goal

Replace the current placeholder implementation of the first five homepage
sections (Hero, About Us, Our Expertise, Our Approach, Industries We Assess)
with a premium, editorial, cinematically-animated version matching the
client brief, while keeping the existing React/Tailwind/Vite foundation.

## Design read (per design-taste-frontend skill)

Institutional investment-consulting redesign for a sophisticated
investor/business audience, editorial-architectural-cinematic language,
bespoke Tailwind + GSAP system (no off-the-shelf design system).
Redesign-Overhaul mode: new visual language and motion, same content and
information architecture (same anchors, nav labels, brand mark).

Dials: `DESIGN_VARIANCE 8` / `MOTION_INTENSITY 7` / `VISUAL_DENSITY 3`.

## Brand system (fixed, from client brief)

- Colors: `#080A0D` `#171714` `#FFFFFF` `#F2F4F6` `#9CA3AA` `#C6E3FA` `#8BBFE8`
- Accent lock: `#8BBFE8` does all interactive/rule/accent work (links,
  active states, expanding rules, focus rings). `#C6E3FA` is a tint/highlight
  color only (never used for interactive affordances).
- Shape lock: radius 0 everywhere (sharp corners only).
- Fonts: Instrument Serif (headings), DM Sans (body/UI). Already wired in
  `src/index.css`. Named explicitly by the client brief, so kept despite
  the taste-skill's general serif caution.
- Body text: 16-18px minimum.
- Brand line: "Clarity Before Capital."
- No section numbering anywhere (00/, 01/, step numbers, etc.) - this is a
  hard client requirement, independently reinforced by the taste-skill's
  own ban on numbered eyebrows.
- Icons: keep `lucide-react` (already a project dependency; taste-skill
  discourages it only as a *default*, not when already in use).

## Architecture

- Split `App.tsx`'s inline section functions into:
  - `src/components/sections/Hero.tsx`
  - `src/components/sections/About.tsx`
  - `src/components/sections/Expertise.tsx`
  - `src/components/sections/Approach.tsx`
  - `src/components/sections/Industries.tsx`
  - `src/components/Header.tsx` (extracted from Hero, numbering-free)
- `src/lib/gsap.ts` - registers `ScrollTrigger` once (guards against
  duplicate registration under Vite HMR).
- `src/data/home-content.ts` - copy arrays (expertise, approach stages,
  industries), no numbering fields, includes an `image` field per item.
- Add `gsap` as a dependency of `@workspace/dcl-consulting`. No smooth-scroll
  library (Lenis etc.) - native scroll + ScrollTrigger is sufficient.
- Motion stack is GSAP-only. Do not add Motion/Framer Motion - the
  taste-skill explicitly warns against mixing GSAP and Motion in the same
  component tree, and GSAP + ScrollTrigger is its recommended tool for
  pinned/scrubbed scrollytelling, which is what Approach and Industries need.
- Breakpoint convention: `gsap.matchMedia()` with a `(min-width: 1024px)`
  "desktop" query gating every sticky/hover/pin behavior, and a
  `(prefers-reduced-motion: no-preference)` query gating all scroll-linked
  motion. Reduced-motion users get instant end-states, no transforms.
- Recurring visual motif: a thin rule that draws (`scaleX`/`scaleY` 0 to 1)
  on scroll or interaction, used differently per section, ties the five
  sections together as one system without repeating layout.

## Section designs

### Hero (dark)

Asymmetric split: headline block left (~58%), tall editorial image panel
right revealed via `clip-path` wipe. Hero stack is capped at exactly 4 text
elements per the taste-skill's hero discipline rule: eyebrow, headline
("Clarity" / "Before Capital." on two lines), subtext (under 20 words), and
two CTAs (primary "Explore Our Expertise", secondary "Start a Conversation").
The current draft's extra tagline strip and bottom "Explore DCL" bar are
removed - they are the banned "tiny tagline below CTAs" pattern.

Load sequence: eyebrow fades up, headline reveals line-by-line (each line
masked in an `overflow-hidden` wrapper, translated into place, staggered),
image panel clips open, CTAs fade up last. Scroll: slow image parallax.
Both CTAs get a magnetic pull toward the cursor (skipped on touch/reduced
motion). Section respects `min-h-[100dvh]` (never `h-screen`) and a `pt-24`
max top padding at desktop.

### About Us (light, `#F2F4F6`)

No eyebrow (per eyebrow-restraint budget - see below). Full-width statement
headline ("Clarity begins with understanding."), then two columns: left
(thin rule, one short line, company facts block) goes `position: sticky` on
desktop only; right column scrolls through body copy and a clip-path
revealed editorial image. Rule under the facts block grows on scroll;
paragraphs fade up individually.

### Our Expertise (dark, `#171714`)

Six services as a full-width text index, no cards, no numbers. Desktop:
hovering or focusing a row brings it to full opacity/color, dims the rest,
expands a blue rule under it, and cross-fades a floating image + detail copy
panel tied to that service. Mobile: accessible accordion
(`button[aria-expanded]`) per service, no image (keeps it light).

### Our Approach (soft-grey, `#EDEEF0` - a blend of `#F2F4F6` toward `#9CA3AA`, distinct from About's background)

No eyebrow. Desktop: left column (headline + intro) pinned via
`position: sticky`; right column lists the five stages (Understand,
Analyse, Challenge, Assess, Advise - no numbering) with generous spacing.
A ScrollTrigger determines the "active" stage as it crosses a fixed line -
active stage goes full opacity/emphasis, others dim to ~30%, and a vertical
blue rule grows alongside the list in step with scroll progress. Mobile:
sticky is dropped; stages fade up in sequence, no pinning.

### Industries We Assess (dark, `#080A0D`)

No eyebrow. Twelve industries as a persistent two-column split: sticky
image panel on one side (CSS `position: sticky`, not GSAP pin), vertical
name list on the other. Hovering/focusing a name highlights it, expands a
blue rule, and cross-fades the sticky image plus a short line of context
copy. Differs visually from Expertise (persistent split vs. floating hover
panel) while sharing the same interaction family, keeping the five
sections feeling like one system without repeating a layout family
back-to-back. Mobile: plain vertical list, name + one line of context each,
no image, no interaction.

## Eyebrow budget (taste-skill Section 4.7)

Max 1 eyebrow per 3 sections, so at most 2 across these 5. Only the Hero
keeps its eyebrow ("Independent insight / London . International" style
positioning line). About, Expertise, Approach, and Industries drop the
small-caps kicker labels used in the current draft - section identity comes
from the headline and page order alone.

## Imagery

18 curated Unsplash editorial/architectural photos total: 1 hero, 1 about,
6 expertise, 12 industries (some sectors may reasonably share a visual
treatment where a distinct photo doesn't add much, e.g. Financial Services
/ Professional Services). All treated consistently (desaturated / graded)
so they read as one system. Placeholders, easy to swap for real DCL
photography later.

## Accessibility

- Every hover-driven state also fires on focus (`onFocus`/`onBlur` mirror
  `onMouseEnter`/`onMouseLeave`) so keyboard users get the same
  image/copy/rule feedback as mouse users.
- Visible `:focus-visible` rings in `#8BBFE8` on all interactive elements.
- All scroll-linked motion gated behind `prefers-reduced-motion`.
- Animate only `transform` and `opacity` (hardware-accelerated).
- No `window.addEventListener('scroll', ...)` - ScrollTrigger / CSS sticky
  only.

## Responsive

Tested at 1440 / 1280 / 1024 / 768 / 430 / 390 / 360px. Fluid `clamp()`
type (existing pattern). No fixed widths that could force horizontal
scroll. Sticky/hover/pin behaviors are desktop-only (`>= 1024px`); every
multi-column layout has an explicit `< 1024px` (or `< 768px` where noted)
fallback declared in the same component.

## Copy discipline (taste-skill Sections 9.G, 4.9)

Zero em-dashes anywhere on the page (headlines, body, captions, alt text,
attribution - use hyphens or restructure the sentence). Self-audit every
visible string before shipping for grammatically broken or AI-sounding
phrasing. Reuse the existing draft's editorial copy voice where it already
fits; rewrite only what needs to lose numbering or an eyebrow it no longer
has.

## Out of scope

- Any section beyond these five.
- Real DCL photography (placeholders only, swappable later).
- CMS/data wiring - content lives in `src/data/home-content.ts` as static
  data for now.
