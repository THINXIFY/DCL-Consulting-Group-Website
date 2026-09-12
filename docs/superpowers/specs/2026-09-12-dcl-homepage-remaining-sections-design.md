# DCL Consulting Homepage: Remaining Five Sections

Date: 2026-09-12
Scope: `artifacts/dcl-consulting`. Adds Who We Advise, Why DCL, DCL at a
Glance, Our Philosophy, and Final CTA after the existing Industries
section. Does not touch Hero, About, Expertise, Approach, Industries, or
the Header. No footer.

## Design read

Continuation of the existing premium editorial/architectural system.
Same brand tokens, same GSAP-only motion stack, same desktop-sticky
patterns already established (`gsap.matchMedia`-free approach: plain
`useMediaQuery('(min-width: 1024px)')` gating, consistent with the first
five sections). Dials unchanged: `VARIANCE 8 / MOTION 7 / DENSITY 3`.

## Section rhythm (per brief, fixed)

1. Who We Advise - light / editorial
2. Why DCL - dark / structured
3. DCL at a Glance - light / institutional
4. Our Philosophy - dark / immersive
5. Final CTA - high-contrast clean finish (stays dark, same background as
   Philosophy, for a seamless transition - no light flash between them)

## Shared conventions carried over

- Colors: `#8BBFE8` for all interactive/rule/accent work, `#C6E3FA` for
  tint/highlight only. Radius 0 everywhere.
- No numbering anywhere (hard rule, independently reinforced again here).
- Eyebrow tagline above every heading (established two turns ago as an
  explicit, standing decision - not the earlier "budget" rule).
- GSAP entrance/scroll animations gated by `useMediaQuery('(prefers-
  reduced-motion: reduce)')`; sticky/hover-index behavior gated by
  `useMediaQuery('(min-width: 1024px)')`.
- Every hover-driven interaction also fires on focus.
- Reuse `getActiveIndex` (already in `src/lib/scroll-active-index.ts`)
  wherever a scroll position needs to map to an active item - it is
  already unit-tested and used by Approach.
- Continue the picsum.photos seeded-image placeholder convention only
  where a section actually calls for photography (none of these five
  sections do - see per-section notes).

## Who We Advise (light, `#F2F4F6`)

Explicitly not three cards. Desktop: left column sticky (headline +
intro, same CSS-sticky technique as About/Approach), right column lists
the three audiences (Private Capital, Corporate Ambition, Strategic
Opportunity) full-height each, separated by thin rules. Active audience
is determined by scroll position via a `ScrollTrigger.create` + the
shared `getActiveIndex` helper (same mechanism as Approach, different
visual composition since there is no numbered stage list and instead a
large ghost-type watermark of the active audience name renders faintly
behind/beside the copy, replacing photography - keeps things typographic
and avoids repeating stock-photo-driven imagery already used elsewhere
on the page). A background tint moves subtly between three very-low-
opacity washes as the active audience changes. Baby-blue rule expands
under the active title; inactive items dim. Mobile: plain stacked list,
no scroll-linked logic, all three audiences fully visible with their
copy.

## Why DCL (dark, `#171714`)

Not feature cards. Four qualities (Independent Perspective, Analytical
Discipline, Commercial Understanding, Clear Communication) as staggered,
increasingly-indented full-width rows. Desktop: hover/focus drives the
active row - active title shifts right slightly, its rule expands, its
explanation expands open (others collapse to title-only, dimmed) -
distinct from Expertise's always-visible-copy-plus-image pattern. Mobile:
no collapse at all - every row's explanation is simply visible and
stacked, satisfying "no hover-only interaction."

## DCL at a Glance (light, `#FFFFFF`)

The calmest section on the page by design - a static "company record"
with no hover interactivity, contrasting with the animated sections
around it. Large serif company name with a masked line reveal (same
technique as Hero's headline), then a ledger of five facts (Company,
Company Type, Registered In, Company Number, Director) as label/value
rows with a single hairline under each, no boxes. Rows fade up in
sequence and the hairlines draw in (`scaleX` 0 to 1) as they enter view -
otherwise no motion. Only real facts from the brief; nothing invented.

## Our Philosophy (dark, `#080A0D`, "most visually memorable")

Desktop: a tall wrapper (five viewport-heights) with a `position: sticky`
inner viewport that stays pinned while the user scrolls through it. A
`ScrollTrigger.create` reports progress across that wrapper, mapped via
`getActiveIndex` (reusing the same tested helper as Approach and Who We
Advise) to pick which of the five philosophy statements is showing. The
active statement crossfades/masks in while the previous one fades out;
one key word per statement renders in `#8BBFE8`. A thin progress rule
advances in step with raw scroll progress across the whole pinned
distance. This differs from Approach's architecture (two-column, headline
static beside a scrolling list) since here the *statement itself* is the
sticky element that changes - a single full-bleed centered moment, not a
split layout. Mobile: no pinning - all five statements shown sequentially
with simple fade-up reveals, exactly as the brief requires.

## Final CTA (dark, `#080A0D` - same as Philosophy for a seamless cut)

Not a Hero re-run: no image, no split layout, no asymmetric grid -
architectural, centered, generous whitespace. Oversized serif headline
("Bring greater clarity to the next decision.") with a masked line
reveal, supporting copy fade-up, a full-width rule expanding above the
CTA row, then two CTAs revealed last: "Start a Conversation" (primary,
filled `#C6E3FA`/`#8BBFE8` per the established button system, since this
is the priority ask at the end of the page - note this swaps which label
gets primary treatment versus the Hero) and "Explore Our Expertise"
(secondary, outlined). Both CTAs reuse the `useMagnetic` hook already
built for the Hero. A small supporting line ("Independent perspective.
Structured analysis. Clearer decisions.") sits below as a quiet closing
note. No footer.

## Data

New arrays in `src/data/home-content.ts` (existing arrays untouched):
`whoWeAdvise` (3: title, copy), `whyDcl` (4: title, copy), `companyFacts`
(5: label, value - the exact facts from the brief, nothing else), and
`philosophy` (5: text, highlight - the substring to render in accent
color).

## Out of scope

Footer. Any change to Hero/About/Expertise/Approach/Industries/Header.
Any invented company metric (years of experience, AUM, deal count,
countries served, returns, client numbers).
