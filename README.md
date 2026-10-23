<div align="center">

# ◼ PORTFOLIO.TV

### *The Creative Universe of Tarun Suthar*

**AI Video · Generative Visuals · Editorial Design · Commercial Work**

---

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-portfoliotv.vercel.app-000000?style=for-the-badge&logoColor=white)](https://portfoliotv.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-CMS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=black)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## ◈ What Is This?

**Portfolio.TV** is a fully custom-built, dark-editorial creative portfolio for **Tarun Suthar** — an independent AI Artist & Visual Content Creator. It is not a template. Every pixel, animation, and interaction was intentionally designed.

The site doubles as a **headless CMS** — content is managed through a private admin panel backed by Supabase, and updates go live instantly without redeployment.

---

## ◈ Creative Disciplines

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│   🎬  AI VIDEO & MOVING IMAGES                                   │
│       Short-form cinematic experiments · Motion sequences         │
│                                                                   │
│   🖼  GENERATIVE VISUALS & PORTRAITS                             │
│       AI-assisted imagery · Digital character studies             │
│                                                                   │
│   📐  EDITORIAL & POSTER DESIGN                                  │
│       High-contrast typography · Visual framing concepts          │
│                                                                   │
│   📢  ADVERTISING & UGC CREATIVES                                │
│       Fashion commercials · Garment studies · Silhouettes         │
│                                                                   │
│   🎞  VISUAL STORYTELLING & EDITING                              │
│       Compositing · Color grading · Flow AI · CapCut              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ◈ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 App Router | SSR, dynamic routes, server actions |
| **UI** | React 19 + TypeScript 5.9 | Strict-typed component architecture |
| **Styling** | Vanilla CSS + Tailwind v4 | Zero-CLS design system, `#090909` editorial palette |
| **Database** | Supabase PostgreSQL + RLS | Projects, media, categories with row-level security |
| **Auth** | Supabase Auth | Admin allowlist — no public signups |
| **Storage** | Supabase Storage | Private bucket with signed URL delivery |
| **Hosting** | Vercel (Node.js runtime) | Edge-ready, cookie + server action support |

---

## ◈ Design Identity

```
PALETTE ──────────────────────────────────────────────────────────

  ██████  Background    #090909   Rich near-black canvas
  ░░░░░░  Foreground    #f1f1ee   Off-white editorial type
  ▒▒▒▒▒▒  Border        rgba(241,241,238,0.2)   Restrained separators
  ●●●●●●  Accent        #b64934   Burnt terracotta highlights

TYPOGRAPHY ───────────────────────────────────────────────────────

  Headings   Condensed sans — all-caps editorial weight
  Body       Light tracking — breathing room on dark canvas
  Navigation Vertical writing-mode rail (desktop)
```

---

## ◈ Architecture Overview

```
portfoliotv.vercel.app
│
├── / (Home)
│   └── Dual-lane infinite looping media wall
│       └── Grab-to-scroll · Touch support · Viewport-aware autoplay
│
├── /about
│   └── Two-column editorial grid
│       └── Identity · Statement · Disciplines · Links
│
├── /commercials  /personal  /stories  /category/[slug]
│   └── Category archive pages with media filtering
│
├── /projects/[slug]
│   └── Dynamic project case study with gallery viewer
│
└── /admin  (Private — requires Supabase Auth)
    ├── /admin/login          Auth gate
    ├── /admin/projects       CRUD project list
    ├── /admin/projects/[id]/edit  Upload · Reorder · Publish
    ├── /admin/categories     Create · Rename · Reorder
    ├── /admin/media          Storage archive & usage
    └── /admin/settings       Upload limits & config
```

---

## ◈ Project Structure

```
Portfolio.tv/
│
├── src/
│   ├── app/
│   │   ├── about/                  Editorial About page
│   │   ├── commercials/            Category archive
│   │   ├── personal/               Personal explorations
│   │   ├── stories/                Video stories archive
│   │   ├── category/[slug]/        Dynamic category routes
│   │   ├── projects/[slug]/        Project case study routes
│   │   ├── admin/                  🔒 Protected CMS panel
│   │   │   ├── login/              Auth gate
│   │   │   ├── (protected)/        Admin layout with allowlist check
│   │   │   │   ├── projects/       Project manager
│   │   │   │   ├── media/          Media library
│   │   │   │   ├── categories/     Category manager
│   │   │   │   └── settings/       Config viewer
│   │   │   ├── actions.ts          All server actions
│   │   │   └── upload-media.tsx    Drag-drop uploader + canvas poster
│   │   ├── globals.css             Design tokens & admin CSS system
│   │   ├── layout.tsx              Root shell, OpenGraph, viewport
│   │   └── robots.ts              Crawler directives
│   │
│   ├── components/
│   │   ├── archive.tsx             Category archive wrapper
│   │   ├── media-view.tsx          Responsive picture & video renderer
│   │   ├── media-wall.tsx          Dual-lane infinite looping tracks
│   │   └── site-header.tsx         Navigation rail & mobile menu
│   │
│   ├── lib/
│   │   └── supabase/               SSR-safe Supabase client utilities
│   │
│   └── data/
│       ├── projects.ts             Static project catalog (fallback)
│       └── site.ts                 Identity: bio, email, platform links
│
├── supabase/
│   └── migrations/                 PostgreSQL schema & RLS policies
│
├── scripts/
│   ├── import-portfolio.mjs        One-time content migration script
│   └── verify-supabase-connection.mjs  Smoke test
│
├── migration/
│   ├── projects.ts.bak             Original manifest backup
│   └── MIGRATION_REPORT.md
│
├── ARCHITECTURE.md                 Data flow & deep spec
├── CODING_RULES.md                 Engineering guidelines
└── FEATURE_LOG.md                  Changelog of CMS fixes
```

---

## ◈ Quick Start

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | `20.9+` |
| npm / pnpm / yarn | any |
| Supabase project | optional (for CMS) |

### Installation

```bash
# 1. Clone
git clone https://github.com/tarun-suthar-04/Portfolio.tv.git
cd Portfolio.tv

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# → Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

# 4. Start dev server
npm run dev
```

> **Without Supabase keys:** the site loads the static `src/data/projects.ts` manifest.
> **With Supabase keys:** the live database becomes the content source and the admin panel is fully active.

---

## ◈ Supabase CMS Setup

```
Step 1  Create a Supabase project
        → Disable public signups (Auth → Settings)
        → Create admin user manually (Auth → Users → Add user)

Step 2  Apply database migrations
        → Already applied to project: kegafxkikhxhgdfhdzwm
        → For a new environment: run SQL files in supabase/migrations/

Step 3  Bootstrap the admin allowlist
        → Copy the user UUID from Auth → Users
        → Run: INSERT INTO public.admin_users(user_id) VALUES ('YOUR-UUID');

Step 4  Set environment variables
        NEXT_PUBLIC_SUPABASE_URL              = your project URL
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  = anon/public key
        NEXT_PUBLIC_CMS_MAX_UPLOAD_BYTES      = 524288000  (default 500 MB)

Step 5  Verify
        node scripts/verify-supabase-connection.mjs
        → Open /admin/login and sign in
```

> ⚠️ **Never** expose your Supabase secret key in a `NEXT_PUBLIC_` variable or in any client-side runtime.

---

## ◈ Admin Panel

| Route | Function |
|---|---|
| `/admin` | Dashboard — DB counts, recent projects |
| `/admin/projects` | Create · Edit · Publish · Feature · Delete |
| `/admin/projects/[id]/edit` | Upload media · Reorder gallery · Set cover |
| `/admin/categories` | Create · Rename · Reorder · Delete (if empty) |
| `/admin/media` | Storage archive · Usage per project |
| `/admin/settings` | Upload limits & ordering config |

**Supported Upload Formats**

| Type | Formats |
|---|---|
| Image | JPEG · PNG · WebP · AVIF |
| Video | MP4 · WebM |
| Max size | 500 MB per file (bucket policy) |

---

## ◈ Import Existing Portfolio

```bash
# Dry run (safe — no writes)
node scripts/import-portfolio.mjs --dry-run

# Live import (requires secret key in local shell only)
SUPABASE_URL=... SUPABASE_SECRET_KEY=... node scripts/import-portfolio.mjs
```

The importer **upserts** by slug and Storage path — safe to re-run. Review `migration/import-report.json` after.

---

## ◈ Deploy to Vercel

```bash
# Requirements
✔  Node.js runtime (not static export)
✔  Cookie support
✔  Server actions enabled

# Environment variables to add in Vercel dashboard
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Content updates (publish, upload, edit) go live **instantly** — no redeploy needed.

---

## ◈ Validation

```bash
node scripts/verify-supabase-connection.mjs   # Supabase smoke test
npm run typecheck                              # TypeScript strict check
npm run lint                                  # ESLint
npm run build                                 # Production build
```

---

## ◈ Key Documents

| File | Purpose |
|---|---|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Full data flow, component map, SSR strategy |
| [`CODING_RULES.md`](./CODING_RULES.md) | Engineering standards & accessibility rules |
| [`FEATURE_LOG.md`](./FEATURE_LOG.md) | CMS changelog & fixed issues |
| [`supabase/migrations/`](./supabase/migrations/) | PostgreSQL schema & RLS security policies |

---

<div align="center">

**Built by [Tarun Suthar](mailto:tarunsuthar99833229782@gmail.com)**
*Creative AI · Visual Content · Editorial Design*

[![Email](https://img.shields.io/badge/Email-000000?style=flat-square&logo=gmail&logoColor=white)](mailto:tarunsuthar99833229782@gmail.com)

</div>
