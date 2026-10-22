# Architecture

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router |
| UI | React 19 |
| Language | TypeScript 5 (strict) |
| Styles | Tailwind CSS v4 + authored `globals.css` |
| Rendering | Static (SSG) for all routes |
| Assets | Served from `public/media/` |
| Data | Typed manifest in `src/data/` — no database, no CMS |

## Route Map

```
/                       → page.tsx          MediaWall (featured projects)
/stories                → page.tsx          Archive (category = "Stories")
/commercials            → page.tsx          Archive (category = "Commercials")
/personal               → page.tsx          Archive (category = "Personal")
/personal-work          → page.tsx          Redirect → /personal
/projects/[slug]        → page.tsx          Project detail (statically parameterized)
/about                  → page.tsx          About + contact links
```

## Component Tree

```
RootLayout (layout.tsx)
├── SiteHeader           fixed vertical rail (desktop) / top bar (mobile)
├── [page]
│   ├── MediaWall        two-lane looping media archive
│   │   └── MediaTile → VideoPreview | <img>
│   ├── Archive          filters projects → MediaWall
│   ├── ProjectPage      gallery of MediaView items + next-project nav
│   └── AboutPage        bio + social links
└── SiteFooter           contact + copyright
```

## Data Flow

```
src/data/projects.ts   ──▶  MediaWall (home/archives)
                        ──▶  ProjectPage [slug]
src/data/site.ts        ──▶  SiteHeader, SiteFooter, AboutPage, layout metadata
```

## Rendering Strategy

All routes use **static generation** (`generateStaticParams` for `/projects/[slug]`). No server-side or client-side data fetching. The manifest is bundled at build time.

`SiteHeader` and `MediaWall` are `"use client"` components because they need `usePathname` / `IntersectionObserver`. All other components are React Server Components.

## Key Performance Patterns

- `will-change: transform` on `.media-track` lifts animation to the compositor thread.
- `contain: paint` on `.media-tile` isolates per-tile repaints.
- `content-visibility: auto` on gallery images skips off-screen paint.
- `fetchPriority="high"` on the first two visible wall tiles for LCP.
- `preload="none"` on all wall videos; play is gated by `IntersectionObserver`.
- Long-lived `Cache-Control: immutable` on `/media/*` assets.

## Extending

| Goal | Where to edit |
|---|---|
| Add a project / media | `src/data/projects.ts` |
| Change identity / contact | `src/data/site.ts` |
| Add a new category | Extend `category` union in `projects.ts`, add a route in `src/app/` |
| Add a web font | Import in `globals.css`, update `--sans` variable |
| Add analytics | `src/app/layout.tsx` (Script component) |
| Add a sitemap | `src/app/sitemap.ts` (Next.js built-in) |
