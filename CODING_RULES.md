# Coding Rules

## Data

- Keep all project data in `src/data/projects.ts`. Do not duplicate media lists in route components.
- Keep name, role, bio, contact links, and tagline in `src/data/site.ts`.
- Add every media file's pixel dimensions to the `dimensions` map in `projects.ts` before referencing it.
- Do not add client, credit, or project claims without supplied facts.

## Media

- Place published media in `public/media/`. Preserve source originals in `work/`.
- Optimize images (WebP recommended) and videos (H.264 MP4) before adding to `public/media/`.
- Every `<img>` must have meaningful `alt` text. Decorative duplicates must use `alt=""`.
- Videos must use `preload="none"` unless a specific reviewed need calls for otherwise.
- Archive video previews: `muted`, `loop`, `playsInline`. Project pages: use `<MediaView>` with native controls.

## Accessibility

- Use semantic HTML: `<header>`, `<nav>`, `<main>`, `<footer>`, `<figure>`, `<figcaption>`, `<button>`, `<a>`.
- Headings must follow a logical hierarchy (one `<h1>` per page).
- Interactive elements must be reachable by keyboard; never hide content behind hover alone.
- Respect `prefers-reduced-motion` — both in CSS animations and JS video playback.
- External links must include `rel="noreferrer noopener"`.

## Performance

- Mark above-fold images with `loading="eager"` and `fetchPriority="high"`.
- Use `loading="lazy"` and `decoding="async"` on all other images.
- Add `content-visibility: auto` to off-screen heavy sections.
- Keep `will-change: transform` only on elements that actually animate (do not apply globally).

## Components

- Components that need browser APIs (`usePathname`, `IntersectionObserver`, etc.) must declare `"use client"`.
- All other components should be React Server Components (no `"use client"` directive).
- Do not use inline `style` attributes for layout — use CSS classes.

## TypeScript

- Run `npm run typecheck` before committing. Zero type errors required.
- Run `npm run lint` before committing. Zero lint warnings required.
- Run `npm run build` to validate the full static output before deploying.

## Miscellaneous

- Do not commit `node_modules/`, `.next/`, or large unoptimized source files.
- Keep `.gitignore` updated to exclude build artifacts and OS files.
