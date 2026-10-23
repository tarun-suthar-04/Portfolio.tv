# Features

## Implemented

### Media Wall (twicetwice.tv scroll-driven effect)
- Full-viewport two-lane media wall on the home page and all category archive pages.
- Each lane stacks tiles with varying natural aspect ratios, dynamically balanced by height across columns.
- **Scroll-driven opposing parallax** (inspired by twicetwice.tv): movement is driven by user scroll (mouse wheel, touch swipe, trackpad, arrow keys, and click-and-drag) rather than constant auto-scroll.
- Left column scrolls upward (natural direction), while right column scrolls downward in opposing counter-direction for immersive parallax depth.
- Smooth inertia using linear interpolation (`lerp`) and `requestAnimationFrame` for buttery 60fps interaction.
- Seamless infinite looping via 3-loop buffers and `ResizeObserver` dynamic height tracking with zero visual seam or stutter.
- Click-and-drag support with grab/grabbing cursor states; link clicks are suppressed during drag gestures to prevent accidental navigation.
- `prefers-reduced-motion` disables custom transforms and restores standard accessible layout.

### Video Previews (Archive)
- Muted, looping, inline `<video>` elements with poster images.
- Play only when ≥ 35% of the tile is in the viewport (`IntersectionObserver`).
- Pause when the browser tab loses focus (`visibilitychange`).
- Only one archive video plays at a time — any new intersection pauses the previous.
- `preload="none"` — no network cost until a video scrolls into view.

### Project Detail Pages
- Request-time rendered from published CMS content; local manifest fallback before CMS configuration.
- Mixed still/video gallery with native video controls (`<MediaView>`).
- Optional year, description, and credits from the CMS record.
- Sequential next-project navigation link.
- Per-project `<title>` and `<meta description>` via `generateMetadata`.

### Navigation
- Fixed vertical desktop rail with wordmark and nav links.
- Collapsible hamburger menu on mobile (≤ 700px).
- `aria-current="page"` on the active route link.
- All interactive elements have keyboard focus styles.

### Archive Routes
- `/stories`, `/commercials`, `/personal` query the CMS category; `/personal-work` redirects to `/personal`.
- Category pages have their own SEO metadata.
- "Back to archive" link on each project page returns to the correct category.

### About Page
- Role, optional bio, and social/email links from `src/data/site.ts`.
- Links appear only when their values are configured — no dead links shown.
- External links use `rel="noreferrer noopener"` for security.

### SEO & Meta
- Root layout exports full `Metadata` with title template, description, Open Graph, Twitter card, and robots directives.
- `viewport` / `themeColor` exported separately per Next.js 14+ best practice.
- Per-page title and description on About, all archives, and all project pages.

### Accessibility
- `h1.sr-only` on the media wall provides a machine-readable page heading.
- Image `alt` text on all stills; decorative duplicates use `alt=""`.
- Duplicate wall tiles use `aria-hidden` and `tabIndex={-1}` to hide them from assistive tech.
- Reduced-motion respected for both CSS animations and JavaScript video playback.

### Performance
- `fetchPriority="high"` + `loading="eager"` on above-fold tiles for fast LCP.
- `contain: paint` on each media tile for isolated repaint.
- `content-visibility: auto` on project gallery items for off-screen skip.
- Long-lived `Cache-Control: immutable` on `/media/*` assets.
- `compress: true` in Next.js config for Brotli/gzip responses.

---

## Not Implemented

- Search or filtering within archives.
- Custom video player (poster + controls use browser defaults).
- Pagination (all projects load at once — suitable for a small portfolio).
- Side-by-side screenshot comparison against the reference site.
- Vimeo/YouTube embeds (native `<video>` only for local files; remote MP4 URLs work).
- Sitemap / robots.txt (can be added via `src/app/sitemap.ts`).

## CMS additions (2026-10-22)

- Supabase Auth login and allowlisted admin access; no public registration.
- CMS overview with live counts and recent projects.
- Project create, edit, draft/publish, featured toggle, category assignment and delete; unique slug validation is enforced by the database.
- Database-driven categories and generic `/category/[slug]` archives while retaining `/stories`, `/commercials`, `/personal` and `/personal-work`.
- Direct browser-to-Storage uploads for JPEG, PNG, WebP, AVIF, MP4 and WebM. Limit is configurable, default 500 MB.
- Project media browser, video/image preview, cover selection, and file metadata display.
- Public requests dynamically read published content, so updates do not need redeployment.

CMS limitations requiring follow-up: the library supports filename/type/date filters and pagination but has no unused-asset deletion or general asset editing. Category reassignment is performed through project editing. Uploads are direct with byte progress but not resumable; there is no session-expiry banner. Project-level media can be reordered and removed, and the media library includes retry actions for recorded Storage cleanup failures.
