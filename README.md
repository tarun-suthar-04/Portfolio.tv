# Tarun Suthar — Creative AI & Visual Works Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-black?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-black?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.2-black?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=flat-square)](LICENSE)

A high-performance, dark-canvas creative portfolio built for **Tarun Suthar** (`TARUN / VISUAL WORKS`), focusing on AI-assisted visual creation, moving images, editorial design, and digital content production.

Designed with a restrained Swiss editorial aesthetic, featuring a fixed vertical desktop rail, dual opposing interactive looping media lanes, seamless category filtering, and an editorial About page.

---

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
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts & Verification

| Command | Description |
|---|---|
| `npm run dev` | Starts local Next.js development server with Turbopack |
| `npm run typecheck` | Strict TypeScript validation via `tsc --noEmit` |
| `npm run lint` | ESLint static code analysis |
| `npm run build` | Builds optimized production bundle (all 13 static pages) |
| `npm run start` | Runs the production build locally |

---

## Content Customization

### 1. Update Identity & Social Links
Edit [`src/data/site.ts`](src/data/site.ts):
```ts
export const site = {
  name: "Tarun Suthar",
  brand: "TARUN / VISUAL WORKS",
  role: "Creative AI Artist & Visual Content Creator",
  bio: "...",
  email: "cdstarun2004@gmail.com",
  github: "https://github.com/tarun-suthar-04",
  linkedin: "https://www.linkedin.com/in/tarun-suthar-307838266/",
  fiverr: "https://www.fiverr.com/s/AGGqXlY",
  availability: "Open to creative opportunities",
};
```

### 2. Adding New Projects
Edit [`src/data/projects.ts`](src/data/projects.ts):
1. Place optimized media assets inside `public/media/`.
2. Register file dimensions inside the `dimensions` lookup map.
3. Add a new `Project` record with category (`"Stories"` | `"Commercials"` | `"Personal"`), cover image, and gallery items.

---

## Deployment

### Vercel (Recommended)
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Framework preset will automatically detect **Next.js**.
4. Deploy with one click.

---

## Connect & Inquiries

- **Creator:** Tarun Suthar
- **Email:** [cdstarun2004@gmail.com](mailto:cdstarun2004@gmail.com)
- **GitHub:** [@tarun-suthar-04](https://github.com/tarun-suthar-04)
- **LinkedIn:** [Tarun Suthar](https://www.linkedin.com/in/tarun-suthar-307838266/)
- **Fiverr:** [Portfolio Services](https://www.fiverr.com/s/AGGqXlY)
