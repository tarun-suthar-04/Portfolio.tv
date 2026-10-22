# Tarun Suthar — Creative Portfolio

A dark, media-first personal portfolio for photography, filmmaking, and image making. Features a fixed vertical desktop rail, two opposing infinitely-looping media lanes, responsive mobile navigation, and project detail routes. Built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## Quick Start

Requires **Node.js 20.9+**.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
  app/              # Next.js App Router pages
    about/          # About page with bio and contact links
    commercials/    # Commercials archive
    personal/       # Personal archive
    personal-work/  # Redirect to /personal
    stories/        # Stories archive
    projects/[slug] # Dynamic project detail page
    globals.css     # All authored styles (dark palette, rail, wall, responsive)
    layout.tsx      # Root layout with SEO metadata
  components/
    media-wall.tsx  # Two-lane media archive wall (home + category pages)
    media-view.tsx  # Still/video renderer for project detail pages
    site-header.tsx # Fixed rail (desktop) + collapsible menu (mobile)
    site-footer.tsx # Minimal footer with contact link
    archive.tsx     # Thin wrapper: category filter → MediaWall
  data/
    site.ts         # Identity: name, role, bio, email, social links
    projects.ts     # All projects: title, category, media, order, cover, metadata
public/
  media/            # Optimized media files served at /media/
work/               # Source originals (not served)
```

---

## Add or Update Content

### Personal information
Edit [`src/data/site.ts`](src/data/site.ts):
- `name`, `role`, `bio` — shown on the About page
- `email`, `instagram`, `vimeo` — shown as links if non-empty
- `tagline` — used in HTML `<meta description>`

### Add a project
1. Place your media in `public/media/` (JPG, PNG, WebP, MP4). Keep originals in `work/`.
2. Add the file's pixel dimensions to the `dimensions` map in [`src/data/projects.ts`](src/data/projects.ts).
3. Add a `Project` entry:

```ts
{
  id: "04",
  slug: "your-project",           // URL-safe, unique
  title: "Your Project Title",
  category: "Personal",           // "Stories" | "Commercials" | "Personal"
  order: 4,                       // display order in archive
  featured: true,                 // show on the home media wall
  year: "2026",
  description: "Short description shown on the project page.",
  cover: image("cover.jpg", "Alt text for cover"),
  media: [
    image("cover.jpg", "Alt text"),
    video("film.mp4", "Short description", "poster.jpg"),
  ],
}
```

For **remote videos**, use the full URL directly in the `src` field.

### Remove placeholder projects
The three starter groups (`garment-studies`, `moving-image`, `image-making`) use working titles. Replace them with your actual project names, descriptions, and credits before launching.

---

## Checks

```bash
npm run typecheck   # TypeScript — must pass before committing
npm run lint        # ESLint
npm run build       # Full production build
```

---

## Deploy

**Vercel (recommended):** Import the repository; Vercel auto-detects Next.js. Set build command `npm run build` and output directory `.next`.

**Any Node host:** `npm run build` then `npm run start`.

> **Important:** Optimize large media files before publishing. The site serves everything from `public/media/` directly. Use `cwebp`/`ffmpeg` to convert images to WebP and compress MP4s before adding them to the folder.

---

## Performance Notes

- Above-fold media wall tiles use `fetchPriority="high"` and `loading="eager"` for fast LCP.
- Video tiles use `preload="none"` and only play when in the viewport.
- Media assets get a one-year `Cache-Control: immutable` header.
- `content-visibility: auto` is applied to off-screen gallery items.
- `contain: paint` isolates media tile repaints.
- Next.js image optimization outputs AVIF/WebP variants when `next/image` is used.

---

## Reference

[`REFERENCE_ANALYSIS.md`](REFERENCE_ANALYSIS.md) documents the design reference (twicetwice.tv), evidence confidence levels, and what was verified versus inferred.
