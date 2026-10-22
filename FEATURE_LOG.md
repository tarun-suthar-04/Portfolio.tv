# Feature Log

## 2026-10-22 — Fix Portfolio Archive Image Caption Alignment

### Problem Diagnosed
- In the project gallery layout (`/projects/[slug]`), each image has metadata captions (`STILL` / `MOVING IMAGE` and sequential index `01`, `02`, `03`...).
- Previously, `<figure className="gallery-item">` stretched across 6 or 10 grid columns, while the child `<img>` element was constrained by `max-height: 88vh` or its intrinsic aspect ratio.
- `<figcaption>` spanned the full width of the grid track (e.g., 600px–1100px), causing captions to drift far away to the container and viewport margins rather than hugging the image frame.

### Root-Cause Resolution
- **Shared Semantic Figure Container**: Refactored `src/app/projects/[slug]/page.tsx` so that `.gallery-item` (the grid cell) wraps a dedicated semantic `<figure className="gallery-frame">` containing both the media and its `<figcaption>`.
- **Exact Intrinsic Sizing via `display: table`**: Styled `.gallery-frame` with `position: relative; display: table; width: fit-content; max-width: 100%;`. In CSS, table formatting context shrink-wraps the container strictly to the rendered content width of the replaced element (`img` / `video`), preventing the container from expanding to the full grid track.
- **Natural Media Aspect Ratios**: Changed media rules to `display: block; width: auto; max-width: 100%; height: auto; max-height: 88vh;` so the browser preserves natural aspect ratios without letterboxing or artificial container expansion.
- **Precision Caption Edge Alignment**: `<figcaption>` inside `.gallery-frame` has `display: flex; justify-content: space-between; width: 100%; box-sizing: border-box; padding-top: 8px;`. The left caption (`STILL` / `MOVING IMAGE`) sits precisely at the left edge of the image (0px delta), and the right caption (`01`, `02`, etc.) sits precisely at the right edge of the image (0px delta).
- **Asymmetric Grid Alignments**:
  - Item 0 (`.gallery-item-0`): `margin-right: auto` (anchored to column 1 left margin).
  - Item 1 (`.gallery-item-1`): `margin-left: auto` (anchored to column 12 right margin with editorial `8vw` top offset).
  - Item 2 (`.gallery-item-2`): `margin-inline: auto` (centered within the 10-column centerpiece track).
- **Mobile Responsiveness**: Under `@media (max-width: 700px)`, `.gallery-frame` expands to `width: 100%`, keeping captions aligned with full-width mobile frames without viewport overflow.
- **Zero Invalidation**: Verified 0.0px alignment delta across portrait, square, landscape, and video assets on desktop and mobile. `npm run typecheck` and `npm run lint` pass with 0 errors.

---

## 2026-10-22 — Revert Image File Edits & Set Container Background Areas to Black

- Restored all original image files (`public/media/*`) from backup without any modifications to the original photo/artwork pixels.
- Removed cache-busting query strings (`?v=2`) from [`src/data/projects.ts`](file:///d:/REA%20Portfolio/src/data/projects.ts).
- Changed all image container and backdrop CSS area colors behind the images from off-white/beige (`#e6e3dc`, `#e4e0d8`, `#111`) to pure black (`#090909`):
  - `.gallery-item img, .gallery-item video`: `background: #090909` (was `#e6e3dc`).
  - `.project-cover`: `background: #090909` (was `#e4e0d8`).
  - `.media-tile`: `background: #090909` (was `#111`).
  - `.wall-image, .wall-video`: `background: #090909`.
- Verified `npm run typecheck` and `npm run lint` pass with 0 errors.

---

## 2026-10-22 — Relocate Contact Details to About Section & Remove Global Footer

- Removed `<SiteFooter />` from [`src/app/layout.tsx`](file:///d:/REA%20Portfolio/src/app/layout.tsx), eliminating the bottom "Have a project in mind? Contact details coming soon" footer from all pages.
- Relocated contact details directly into the About page ([`src/app/about/page.tsx`](file:///d:/REA%20Portfolio/src/app/about/page.tsx)), featuring:
  - "Contact & Inquiries" section with mailto link for direct outreach.
  - Location display when configured in [`site.ts`](file:///d:/REA%20Portfolio/src/data/site.ts).
  - Social platform links (Instagram, Vimeo).
  - Clean colophon with independent creative portfolio copyright and current year.
- Cleaned up obsolete footer CSS rules from [`src/app/globals.css`](file:///d:/REA%20Portfolio/src/app/globals.css).
- Verified `npm run typecheck` and `npm run lint` with 0 errors.

---

## 2026-10-22 — Scroll-Driven Opposing Parallax Media Wall (twicetwice.tv style)

### Motivation & Behavior
- Analyzed `https://www.twicetwice.tv/` and user screen recording.
- Replaced the continuous CSS infinite auto-scroll with an interactive, user-driven opposing parallax scroll effect.
- The media wall now remains static when idle and moves exclusively in response to user scroll input.
- **Opposing directions**: scrolling down drives the Left column upward (natural direction) and the Right column downward (counter-directional parallax).
- **Infinite wrapping**: built with a 3-buffer loop structure (pre-buffer, active set, post-buffer) and dynamic modulo offset computation, ensuring seamless 100% gapless looping in both directions.
- **Smooth inertia**: virtual scroll position smoothed via linear interpolation (`lerp`) with a 0.09 easing factor in `requestAnimationFrame`.
- **Full input support**: mouse wheel (with Firefox line-mode delta normalization), touch drag gestures with velocity-based release momentum, click-and-drag with `grab`/`grabbing` cursor states, and keyboard navigation (`ArrowUp`, `ArrowDown`, `PageUp`, `PageDown`, `Space`).
- **Drag safety**: suppresses project tile link click events if a drag gesture exceeds 5px, preventing unintended page navigation while panning.
- **Dynamic measurement**: `ResizeObserver` monitors exact rendered loop height and recalculates boundaries on window resize or layout updates.
- **Accessibility**: fully honors `prefers-reduced-motion` by disabling parallax transforms and restoring standard responsive layout.
- `typecheck` and `lint` validated with 0 errors.

---

## 2026-10-22 — Performance, SEO & Documentation Pass

### Code Changes

**SEO**
- Added full `Metadata` export to `layout.tsx`: title template, description, authors, Open Graph, Twitter Card, robots.
- Separated `viewport` / `themeColor` export per Next.js 14+ API.
- Added `generateMetadata` to `/projects/[slug]/page.tsx` for per-project titles and descriptions.
- Added `Metadata` exports to `/about`, `/commercials`, `/stories`, `/personal-work`.

**Performance**
- `next.config.ts`: enabled Next.js image optimization (AVIF/WebP output), `compress: true`, `Cache-Control: immutable` on `/media/*`, `optimizePackageImports` for React.
- `media-wall.tsx`: first two tiles in each first-copy sequence use `loading="eager"`, `fetchPriority="high"`, `decoding="sync"` for faster LCP.
- `media-wall.tsx`: `prefetch={false}` on `<Link>` tiles prevents mass prefetching of all project pages.
- `globals.css`: `contain: paint` on `.media-tile` for isolated repaints.
- `globals.css`: `content-visibility: auto` + `contain-intrinsic-size` on gallery items.
- `globals.css`: added `.sr-only` utility class (was used but not defined).

**Bug fixes**
- Removed development instruction text from `AboutPage` that would render to visitors in production.
- Removed `contactPlaceholder` dev string from `site.ts`.
- Added `rel="noopener"` to external links on the About page.

**DX**
- Added `bio` field to `site.ts` for the About page introduction.
- Reformatted multi-line JSX in `ProjectPage`, `AboutPage`, and `MediaWall` for readability.

### Documentation

All `.md` files rewritten to reflect the current project state:
- `README.md` — project structure tree, content editing guide, deploy notes, performance notes.
- `ARCHITECTURE.md` — stack table, route map, component tree, data flow, rendering strategy, performance patterns.
- `FEATURES.md` — organized feature list, implemented vs not-implemented.
- `DESIGN.md` — design tokens table, layout breakdown, wall mechanics, motion budget table.
- `CODING_RULES.md` — expanded with data, media, accessibility, performance, component, and TypeScript sections.
- `PROJECT_CONTEXT.md` — content status table, media inventory, launch checklist.
- `PROJECT_REPORT.md` — improvements table, current state, validation.

### Validation

- `npm run typecheck`: passed (0 errors).
- `npm run lint`: passed (0 warnings).

---

## 2026-10-16 — Media Wall Implementation

- Replaced conventional card/intro home layout with a two-lane, manifest-fed media wall.
- Added fixed vertical desktop rail, touch menu, hover/focus/touch captions.
- Added four-copy seamless media tracks with muted looping poster-backed previews.
- Intersection-aware video pause and one-active-preview enforcement.
- Added source dimensions to manifest, optional year/description/credits, detail-page metadata.
- Extracted four local video posters from supplied clips.
- Updated `REFERENCE_ANALYSIS.md` with three verified frames from the provided desktop recording.

Validation: typecheck, lint, build, audit all passed.
