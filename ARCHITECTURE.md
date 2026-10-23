# Architecture

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router |
| UI | React 19 |
| Language | TypeScript 5 (strict) |
| Styles | Tailwind CSS v4 + authored `globals.css` |
| Rendering | Dynamic request-time rendering for CMS public routes and admin |
| Assets | Legacy files in `public/media/`; CMS files in private Supabase Storage |
| Data | Supabase database in production; typed manifest retained for local fallback and import |

## Route Map

```
/                       → page.tsx          MediaWall (featured projects)
/stories                → page.tsx          Archive (category = "Stories")
/commercials            → page.tsx          Archive (category = "Commercials")
/personal               → page.tsx          Archive (category = "Personal")
/personal-work          → page.tsx          Redirect → /personal
/projects/[slug]        → page.tsx          Project detail (statically parameterized)
/category/[slug]        → page.tsx          Generic database category archive
/about                  → page.tsx          About + contact links
/admin/*                → App Router        Protected portfolio CMS
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
Supabase projects      ──▶  MediaWall (home/archives)
                        ──▶  ProjectPage [slug]
src/data/projects.ts   ──▶  local preview/import source only
src/data/site.ts        ──▶  SiteHeader, SiteFooter, AboutPage, layout metadata
```

## Rendering Strategy

CMS-enabled public routes use dynamic rendering and query Supabase at request time with caching disabled. `/projects/[slug]` is not statically parameterized. The manifest is used only for local development without configured Supabase credentials and as the repeatable import source.

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

## CMS architecture (2026-10-22)

- The app now requires a Node.js capable Next.js host for request-time rendering and server actions. Static export is not supported for the CMS-connected build.
- Public routes call `src/lib/content.ts` with `unstable_noStore`; configured instances query published projects and database categories on each request. Media is stored in a private Supabase bucket. `src/app/cms-media/[...path]/route.ts` returns a short-lived signed redirect, with Storage RLS permitting only published media or admin access. Without credentials, development uses the original manifest as a preview fallback; production returns no manifest projects.
- Supabase SSR cookie sessions are refreshed by `src/middleware.ts`. Admin mutations use server actions which check `auth.getUser()` and the `admin_users` allowlist; Postgres RLS and Storage policies independently authorize data operations.
- `supabase/migrations/20261022151231_cms_schema.sql` defines categories, projects, project media, cleanup queue, indexes, triggers, policies, and bucket. `supabase/migrations/20261022151524_admin_policy_index_tuning.sql` refines admin policies and indexes. Both are applied to the configured Supabase project. Categories are relationally one-to-many with projects; media is many-to-one with projects. Cover reference is deferred to avoid circular creation issues.
- The migration script `scripts/import-portfolio.mjs` reads the original TypeScript manifest, uploads referenced local assets, and upserts rows by slug/path for repeatable import.
- Content changes require no deployment. There is no ISR cache to invalidate; CMS-backed routes are dynamically rendered with cache disabled.

### Admin routes

`/admin/login`, `/admin`, `/admin/projects`, `/admin/projects/new`, `/admin/projects/[id]/edit`, `/admin/categories`, `/admin/media`, `/admin/settings`.

### Runtime environment

Use `.env.example` as the placeholder reference. Public key variables are the Supabase URL and publishable key. `SUPABASE_SECRET_KEY` is for the one-time import script only and must never be set with a `NEXT_PUBLIC_` prefix or used by app routes.
