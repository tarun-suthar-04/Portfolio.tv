# Design

## Visual Language

| Token | Value | Use |
|---|---|---|
| `--paper` | `#090909` | Page canvas, rail, wall background |
| `--ink` | `#f1f1ee` | Primary text, headings |
| `--muted` | `#92928d` | Secondary labels, captions, eyebrows |
| `--line` | `rgba(241,241,238,.2)` | Dividers, borders |
| `--accent` | `#b64934` | Brand dot, hover color, active nav |
| `--gutter` | `clamp(22px,4.1vw,68px)` | Inline padding on page shells |

Font: `Arial, Helvetica, sans-serif` — system fallback stack. Replace `--sans` in `:root` to use a web font.

## Layout

### Desktop (> 700 px)
- 40 px fixed left rail (`position: fixed; inset: 0 auto 0 0`) contains the vertical wordmark and rotated navigation links.
- Page content has `padding-left: 40px` to clear the rail.
- Wide gutters scale with `clamp()` up to 68 px on large screens; above 1600 px the gutter auto-centers content at ~1480 px max.

### Mobile (≤ 700 px)
- Rail collapses to a 54 px top bar (`position: fixed; inset: 0 0 auto`).
- Content gains `padding-top: 54px` to clear the bar.
- A hamburger menu toggles the vertical nav as an absolute overlay.

## Media Wall

- Two columns equal width, separated by a `clamp(8px,1.15vw,16px)` gutter, with matching outer padding.
- Each column receives items from the manifest in a height-balanced greedy pass (shorter column gets the next item).
- Media tiles are full-column-width with natural aspect ratios (`width: 100%; height: auto`).
- The track repeats with 3-loop buffer sets (pre-buffer, primary set, post-buffer). Motion is driven by user scroll input: Lane 1 scrolls upward (natural direction at 1.0× speed) while Lane 2 scrolls downward (opposing counter-directional parallax at 0.8× speed).
- Movement is smoothed at 60fps via linear interpolation (`lerp` with factor 0.09) and `requestAnimationFrame`. No constant auto-scroll runs while the user is idle.
- Boundary wraps occur seamlessly through dynamic modulo offsets calculated via `ResizeObserver`.
- `will-change: transform` on `.media-track` promotes the lane to a GPU compositor layer.

## Tiles and Captions

- Tiles have no border; a thin `#111` background shows during image loading.
- Hover/focus: a 0→1 opacity `tile-caption` overlays a gradient and shows the project name and category.
- Touch layouts always show the caption (`opacity: 1` in the ≤ 700 px breakpoint).
- A 32 px circular arrow icon appears on hover in the original card layout (present in CSS, not on wall tiles).

## Project Detail

- Gallery items alternate in a 12-column grid: items 0, 3, 6 … span columns 1–6; items 1, 4, 7 … span columns 7–12 with an 8 vw top offset; items 2, 5, 8 … span columns 2–11 (wide, centered).
- Videos and stills share the same `<figure>` + `<figcaption>` treatment.
- Figcaptions show "Still" / "Moving image" + a zero-padded index.
- On mobile the gallery collapses to a single-column stack with 30 px row gaps.

## Motion Budget

| Element | Duration | Easing |
|---|---|---|
| Media lane scroll | Continuous (user-driven) | `lerp(0.09)` inertia via rAF |
| Tile caption fade | 0.25 s | `ease` |
| Nav link color | 0.2 s | `ease` |
| Project cover scale | 0.7 s | `cubic-bezier(.2,.7,.2,1)` |
| Cover arrow appear | 0.25 s | `ease` |

All transitions and animations are removed (`transition-duration: .01ms`) when `prefers-reduced-motion: reduce` is set.
