# TARUN / VISUAL WORKS

Portfolio of Tarun Suthar: creative AI, moving images, generative visuals, editorial design and commercial work. The existing monochrome editorial site is backed by an optional Supabase CMS.

## Stack

- Next.js 16 App Router, React 19, TypeScript strict mode, Tailwind CSS v4 and authored CSS.
- Supabase Auth, PostgreSQL with RLS, and Storage for CMS media.
- Node.js capable Next hosting is required. Static export cannot run admin auth, server actions or dynamic database queries.

## Local development

<<<<<<< HEAD
```sh
=======
## What This Project Is About

This portfolio showcases the creative practice of **Tarun Suthar**, an independent **Creative AI Artist & Visual Content Creator**. The site is structured to exhibit work across:

- **AI Video & Moving Images:** Short-form video experiments, cinematic rhythm, and motion sequences.
- **Generative Visuals & Portraits:** AI-assisted imagery, aesthetic portraiture, digital character studies, and wallpapers.
- **Editorial & Poster Design:** High-contrast graphic typography, visual framing, and editorial concepts.
- **Advertising & UGC Creatives:** Fashion-forward commercials, garment studies, silhouettes, and commercial content concepts.
- **Visual Storytelling & Editing:** Image compositing, layering, color grading, and creative tool workflows (Flow AI, CapCut, Canva).

---

## Design & Architecture Highlights

- **Dark Editorial Identity:** Engineered on a rich `#090909` canvas with off-white typography (`#f1f1ee`), restrained borders (`rgba(241, 241, 238, 0.2)`), and burnt-terracotta accent tones (`#b64934`).
- **Fixed Vertical Navigation Rail:** Desktop edge rail with vertical writing mode (`writing-mode: vertical-rl`) providing persistent navigation without obstructing media immersion.
- **Opposing Looping Media Wall:** Two independent, infinitely looping media tracks with grab-to-scroll interaction, touch support, and viewport-aware video playback.
- **Full Viewport Editorial About Page:** Mathematically balanced two-column grid establishing hierarchy between identity, professional statement, creative disciplines, direct email inquiries, and live platform links.
- **Dynamic Project Routes:** Next.js static site generation (`/projects/[slug]`) for individual project galleries, metadata inspection, and media viewers.
- **Mobile Responsive:** Smooth breakpoint collapse to horizontal top header, overlay navigation drawer, and single-column swipeable media layouts.
- **Zero-Dependency Core:** Clean vanilla CSS design system integrated with Tailwind CSS v4, achieving zero layout shift (CLS 0) and rapid loading.

---
[![Architecture diagram of tarun-suthar-04/portfolio.tv](https://gitdiagram.com/tarun-suthar-04/portfolio.tv/diagram.png)](https://gitdiagram.com/tarun-suthar-04/portfolio.tv?utm_source=readme&utm_medium=picture)

## Project Structure

```text
├── public/
│   └── media/                # Served portfolio media (images, posters, MP4 clips)
├── src/
│   ├── app/
│   │   ├── about/            # Redesigned editorial About page
│   │   ├── commercials/      # Commercials & advertising category archive
│   │   ├── personal/         # Personal explorations archive
│   │   ├── personal-work/    # Alias redirect to /personal
│   │   ├── stories/          # Narrative & video stories archive
│   │   ├── projects/[slug]/  # Dynamic project case study routes
│   │   ├── globals.css       # Core design tokens, typography, rail & media-wall CSS
│   │   ├── icon.tsx          # Dynamic SVG/PNG favicon generator
│   │   ├── layout.tsx        # Root HTML shell, OpenGraph, and viewport config
│   │   ├── not-found.tsx     # Custom editorial 404 page
│   │   └── robots.ts         # Automated search engine crawler directives
│   ├── components/
│   │   ├── archive.tsx       # Category archive wrapper with media filtering
│   │   ├── media-view.tsx    # Responsive picture & HTML5 video renderer
│   │   ├── media-wall.tsx    # Dual-lane infinite looping media tracks
│   │   └── site-header.tsx   # Responsive navigation rail & mobile menu
│   └── data/
│       ├── projects.ts       # Central projects catalog, aspect ratios & media paths
│       └── site.ts           # Global identity: bio, email, status & platform links
├── ARCHITECTURE.md           # Deep architectural specification
├── CODING_RULES.md           # Engineering guidelines & accessibility standards
├── INFO.md                   # Single source of truth for portfolio facts
└── tsconfig.json             # Strict TypeScript configuration
```

---

## Quick Start

### Prerequisites

- **Node.js 20.9+** or newer
- **npm** (or pnpm / yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/tarun-suthar-04/Portfolio.tv.git

# Enter project directory
cd Portfolio.tv

# Install dependencies
>>>>>>> 460e9756ae2e2d839025308515c49b62154b723c
npm install
cp .env.example .env.local
npm run dev
```

Without Supabase values, development previews the original `src/data/projects.ts` manifest. Once configured, the CMS database is the public content source. Production without CMS configuration intentionally serves no manifest projects.

## Supabase setup

1. Create a Supabase project. In Authentication settings, disable public signups and create the owner account using the dashboard (Auth → Users → Add user). There is no registration page.
2. The base schema and policy/index tuning migrations have already been applied to project `kegafxkikhxhgdfhdzwm`. For another environment, apply both SQL files in [`supabase/migrations/`](supabase/migrations/).
3. Copy the administrator user's UUID from Auth → Users and execute `insert into public.admin_users(user_id) values ('USER-UUID');` in SQL Editor. This is the explicit administrator bootstrap; never expose it as a public endpoint.
4. `.env.local` is connected to the existing project for local development. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the production host environment. Optionally set `NEXT_PUBLIC_CMS_MAX_UPLOAD_BYTES` (default 524288000). Never expose a Supabase secret key in an app runtime or a `NEXT_PUBLIC_` variable.
5. Run `npm run dev`, sign in at `/admin/login`, and verify the dashboard. RLS limits drafts and mutations to the `admin_users` allowlist. The Storage bucket is private; published asset delivery uses signed redirects and RLS.

## Import the existing portfolio

The original manifest is backed up at `migration/projects.ts.bak`; original files in `public/media/` and `work/` are retained. Run a local validation first:

```sh
node scripts/import-portfolio.mjs --dry-run
```

The schema is applied, but the initial content import still needs a server-only Supabase secret key. Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` only in the local shell used for import, then run:

```sh
node scripts/import-portfolio.mjs
```

The import is repeatable: it upserts categories and projects by slug and media by stable Storage path. It uploads source assets to `portfolio-media`, sets media metadata and cover references, and records a JSON report. Review `migration/MIGRATION_REPORT.md` and the generated `migration/import-report.json`. The import has not been run against a live database in this workspace.

## Admin workflow

- `/admin`: database counts and recently updated projects.
- `/admin/projects`: create, edit, preview, publish/unpublish, feature and remove work.
- `/admin/projects/[id]/edit`: update content, upload multiple image/video files directly to Storage, reorder gallery items, select a cover and remove media.
- `/admin/categories`: create, rename, reorder, and delete empty categories. Existing categories with projects must be reassigned first.
- `/admin/media`: view recently uploaded media and project usage.
- `/admin/settings`: displays current upload behavior and ordering.

Image formats: JPEG, PNG, WebP and AVIF. Video: MP4 and WebM. Uploads go directly from the browser to Storage, up to the configured per-file limit (capped at 500 MB by the bucket policy). The public site uses published project rows only and does not require redeploys for content updates. The original fixed archive routes stay active; additional category archives use `/category/[slug]`.

## Deploy

Deploy the existing Next.js application to its existing host only if it supports a Node.js runtime, cookies, and server actions (for example, Vercel). Do not enable static export. Add the two public Supabase environment variables to the host and redeploy once to activate CMS code. Run SQL migration and the content import before switching traffic; keep a database backup and preserve local media. Routine content changes afterward do not require deployment. Published Supabase Storage assets are delivered through signed redirects from the private bucket.

## Validation commands

```sh
node scripts/verify-supabase-connection.mjs
npm run typecheck
npm run lint
npm run build
```

The Supabase smoke check uses the publishable key and confirms the starter categories, published-content visibility, and anonymous denial on the admin allowlist.

See `ARCHITECTURE.md` for data flow, `PROJECT_CONTEXT.md` for current repository state and `supabase/migrations/` for schema/security policies.
