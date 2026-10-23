# Project Context

## About

Tarun Suthar's personal creative portfolio for photography, video, filmmaking, and visual experiments. The site is a media-first, dark-canvas archive with a fixed desktop edge rail and a two-lane scrolling wall of images and videos.

## Design Reference

Inspired by [twicetwice.tv](https://www.twicetwice.tv/) — a Paris/Oslo film studio site. Full evidence log and confidence levels are in [`REFERENCE_ANALYSIS.md`](REFERENCE_ANALYSIS.md).

## Content Status (as of 2026-10-22)

| Field | Status |
|---|---|
| Project titles | Working titles — replace before launch |
| Project descriptions | Not set — add via `projects.ts` |
| Project credits | Not set |
| Personal bio | Not set — add via `site.ts` |
| Email | Not set |
| Instagram | Not set |
| Vimeo | Not set |

## Media Inventory

| Location | Count | Notes |
|---|---|---|
| `public/media/` | 23 files | 7 images, 6 videos, 4 video posters, plus unused assets |
| `work/` | Source originals | Not served — backup only |

**Referenced in projects.ts:** 19 assets + 4 generated video posters.  
**Unused in `public/media/`:** `my asus.jpg` and `gemini_generated_video_be44981f.jpg` are referenced but map to test content — review before launch.

## Launch Checklist

- [ ] Replace working project titles with real names
- [ ] Add project descriptions and credits
- [ ] Fill in `site.bio`, `site.email`, `site.instagram`, `site.vimeo`
- [ ] Optimize all images to WebP (target < 300 KB each)
- [ ] Compress all MP4s (target < 5 MB each for preview clips)
- [ ] Remove or rename placeholder project slugs
- [ ] Run `npm run build` and verify all routes
- [ ] Deploy to Vercel or another Node.js host
- [ ] Add `sitemap.ts` for search engine indexing

## CMS status (2026-10-22)

The repository includes the CMS and is connected locally to Supabase project `kegafxkikhxhgdfhdzwm`. Both versioned migrations are applied; the project has 3 starter categories, a private `portfolio-media` bucket, and no projects/media yet. The ignored `.env.local` contains only the project URL and publishable key. Production content cutover remains pending until the owner Auth account is allowlisted, legacy media is imported with a server-only secret key, and public deployment variables are configured. Original manifest backup: `migration/projects.ts.bak`. Dry-run report: `migration/import-report.json`.

Required runtime: Next.js 16 Node.js server runtime; static export is incompatible with login, server actions and dynamic CMS reads. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and optionally `NEXT_PUBLIC_CMS_MAX_UPLOAD_BYTES`.
