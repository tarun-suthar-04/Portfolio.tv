# Reference analysis: Twice

**Target:** https://www.twicetwice.tv/  
**Inspection date:** 2026-10-16  
**Purpose:** Design and behavior reference for a personal creative portfolio. This report describes observable structure only; it does not propose copying the studio's identity, copy, or media.

## Evidence and confidence

### Verified from accessible page content

The web reader returned rendered page text, link labels, image labels, and page URLs for the home page, category pages, About page, and two project pages. REA website-inspection tools and the computer-use browser surface were unavailable. After the owner supplied a screen recording, I extracted three still frames at approximately 0, 2, and 4 seconds and inspected those visually. This provides pixel-level layout evidence at those moments, but not DOM/styles, exact font metadata, full interaction timelines, or a mobile view.

### Not verified

Exact font family, measured CSS values, responsive breakpoints, transition timing, video loop/audio behavior, and mobile layout remain unknown. Page text and link captures were crawled at different dates (home/current, archive pages from months ago, project pages from five months ago), while the recording is from 2026-10-16. Some differences between them may reflect site changes.

## Direct observations from the supplied screen recording

**Evidence:** `Screen Recordings/Screen Recording 2026-10-16 150505.mp4`; sampled frames at approximately 0s, 2s, and 4s (browser window capture about 1200 × 642 px including browser chrome).

- A near-black page canvas fills the view. A very narrow rail, about 32 px in the sampled capture, stays at the left edge while media changes behind it. The rail shows a vertical wordmark near its top and vertical links for Personal Work, Commercials, Stories, and About.
- A dense media wall starts immediately to the right of the rail: two visible vertical lanes, approximately equal width, separated by a narrow black gutter. Each lane stacks tiles independently; tile heights/aspect ratios vary. There is no large introduction or conventional title/card frame above the work in the sampled scroll position.
- Still images and cinematic moving images occupy the same tile layout. Captured frames show different footage across the three samples. The recording does not establish whether every tile autoplays, whether clips loop, or whether some frame changes are caused by scrolling.
- In sampled hover states, a small white project name appears directly over a media tile near the pointer. The title is minimally styled and there is no large caption panel.
- The rail remains in the same position while the media composition seen on screen changes. This supports a fixed edge rail and a moving media wall. The short recording does not establish whether movement is caused by user scrolling or automatic opposing column loops, and does not show a shuffle/rearrangement animation.
- The recording provides no mobile or tablet viewport. It does not provide enough frames to measure hover timing, transition curves, or exact scroll speed.

## Observed page structure

### Shared shell

- The home page and inspected secondary pages share a wordmark image labelled “twice,” the short word sequence “twice / refined / better,” and a “becomes” line around a logo image. The exact visual composition cannot be established from text extraction.
- Primary navigation links: **Stories**, **Commercials**, **Personal Work**, and **About**.
- A repeated “Projects” section lists the category links, followed by location/contact information. Paris is shown with a street address; Oslo is also named (the extracted page text repeats Oslo and does not make clear whether that repetition is intentional or a rendering artifact).
- Category/project pages repeat the same navigation and location block in the extracted content, suggesting a persistent shared site shell. Whether it is literally fixed/sticky during scroll is unknown.

### Home / Stories (`/` and `/stories`)

- The home page extraction is brief: brand text, navigation, “Projects,” category links, Paris/Oslo locations, and a logo image.
- `/stories` adds a client/project feature area. Extracted names include Louis Vuitton, Stanley/Stella, Valentino, Willy Chavarria, Lacoste, and Carolina Herrera, plus six cover-image elements and repeated “Same Taste, Twice Better” text. The repeated phrase may reflect a marquee or duplicated accessible text, but that behavior is unverified.
- The home and Stories captures do not expose a complete project archive through the extracted text. The Stories page has more than the initial six image items in its output, but their names were not available in the text capture.

### Commercials (`/commercials`)

- A heading “Commercials” precedes a long, ordered list of client/project links. At least 22 entries were exposed, including AIGLE, LEVI'S, HEETCH, STANLEY & STELLA, ACUITIS, VENOMOUS, UNDIZ, LOTUS, YSÉ, L'ARTISAN PARFUMEUR, BONANZA, SARENZA, CLAUDIE PIERLOT, ADIDAS ORIGINALS, UBER EATS, TARA JARMON, PALLADIUM, TOMMY JEANS, and MERZ.
- Link labels appear to be client names, not descriptive project titles. Whether this is a complete archive or a partial/lazy-loaded list is unknown.

### Personal Work (`/personal-work`)

- A heading “Personal Work” precedes four visible project links: “CECI EST NOTRE MANIFESTO,” “TO THE MOON,” “JE SUIS NON DESIRE,” and “MILK.”
- The difference in list length from Commercials implies separate curated categories, but the site does not expose filtering controls in the text capture.

### About (`/about`)

- The page contains French and English biography sections, each naming Paris or Oslo. The English text describes two brothers making emotionally and visually resonant films, based in Paris and Oslo and available worldwide.
- Contact details include a Paris address, an Oslo location, Instagram and Vimeo links, and `hello@twicetwice.tv`.

### Project detail (`/project/aigle-cherish-the-sea`, `/project/ceci-est-notre-manifesto`)

- Both inspected detail pages retain the shared navigation/location shell.
- Each shows a project/client image, an H1 matching the project name, a `00:00:00` time display, four still-image elements labelled as stills, and a “Next Project” link. AIGLE points next to MERZ; the personal film points next to ADIDAS ORIGINALS.
- The time display plus project image may correspond to a video player, but playback controls, duration, and behavior were not observable. The extracted text did not show project credits, descriptions, or metadata for these two examples.
- A third project link (“TO THE MOON”) led to a cache-miss error in the reader, so its detail page was not inspected.

## Design characteristics: evidence vs. inference

| Topic | Verified observation | Inference / unknown |
|---|---|---|
| Typography | Recording shows small sans-serif navigation and white uppercase project names. The supplied implementation keeps its existing font family and typographic character. | Exact font family, weight, line-height, measured sizes, and scaling remain unknown. |
| Layout | Recording shows a near-black canvas, a narrow left rail, and two independently stacked media lanes with narrow gutters and varied tile proportions. | Pixel-accurate measurements, exact crop rules, and behavior at other desktop widths are unknown. |
| Media | Photos and moving images appear together as the same borderless tile treatment. | Specific codecs, hosting, autoplay policy, sound, loop behavior, and original lazy-loading rules are unknown. |
| Interaction | Navigation links and project routes are exposed by page text. The recording shows project names over media in sampled hover states. | Keyboard focus styling, hover timing, click animation, and touch equivalents are not visible in the recording. |
| Scrolling / movement | The fixed rail stays in place as different media content appears in the viewport. | Whether movement is manual scrolling or automatic looping is uncertain; the short recording does not verify opposing directions or an infinite loop. |
| Responsive behavior | No mobile or tablet viewport appears in the recording. | Breakpoints, mobile navigation treatment, grid column changes, and touch behavior are unknown. |

## Interaction map from exposed links

- Shared primary navigation routes to Stories, Commercials, Personal Work, and About.
- Category lists route to project details; a sampled Commercials item opened the AIGLE project, and a sampled Personal Work item opened CECI EST NOTRE MANIFESTO.
- Project pages expose a next-project route, establishing a sequential browsing path between projects.
- About exposes Instagram, Vimeo, and email contact.
- Hover titles are visible in two sampled frames of the supplied recording; the exact hover transition is unknown.
- No evidence was available for search, filters, pagination, modal overlays, or back-to-top controls.

## Implementation plan for an original portfolio

This plan uses the observed information architecture and media-led project browsing as inspiration. All content, naming, art direction, type choices, and visual assets should come from the portfolio owner.

1. Keep the home/archive focused on a full-height media wall with a fixed edge rail and no large introduction above the work.
2. Store each project title, category, cover, aspect-ratio metadata, and ordered still/video sequence in a typed manifest. Use only the portfolio owner's assets and facts.
3. Stack media in two vertical lanes with varied natural proportions and close gutters. Per the user's follow-up, move one lane down and the other up in a seamless infinite loop. This is an explicit implementation requirement, not a verified observation from the recording.
4. Reveal small project/category labels over the tile on hover and keyboard focus; keep the labels available to touch users without hover.
5. Use poster-backed, muted, inline looping video previews only while tiles are visible. Pause offscreen/background previews, limit concurrent playback, and use native controls on project pages.
6. Keep a compact navigation rail on desktop and provide an adequately sized expandable navigation and two-column media wall on mobile while the original mobile behavior remains unknown.
7. Preserve project detail routes, archive return links, and sequential next-project navigation. Add descriptions/credits only when supplied.
8. Compare the implementation at reference and mobile widths once browser capture is available; the original recording only provides desktop evidence.

## Evidence log

- Home: `https://www.twicetwice.tv/` — accessible page extraction returned brand/navigation/project/location text and a logo image.
- Stories: `https://www.twicetwice.tv/stories` — extracted client names, cover-image labels, and repeated tagline text.
- Commercials: `https://www.twicetwice.tv/commercials` — heading and ordered client/project links.
- Personal Work: `https://www.twicetwice.tv/personal-work` — heading and four project links.
- About: `https://www.twicetwice.tv/about` — bilingual description, locations, address, social links, and email.
- Sample project detail: `https://www.twicetwice.tv/project/aigle-cherish-the-sea` and `https://www.twicetwice.tv/project/ceci-est-notre-manifesto` — title, time display, four still-image labels, and next-project link.
- Screen recording: `Screen Recordings/Screen Recording 2026-10-16 150505.mp4` — three extracted desktop frames used to verify the dark canvas, fixed vertical rail, two media lanes, uneven stacking, and sampled hover titles.

**Coverage:** Page structure and exposed route links were inspected from accessible text. The supplied recording adds visual evidence for desktop layout, rail position, media lanes, tile variation, and hover labels. The recording does not settle exact typography, CSS measurements, loop/audio behavior, complete archive contents, responsive breakpoints, or mobile interaction. No side-by-side local browser screenshot comparison was possible in this session because browser-control targets were unavailable.
