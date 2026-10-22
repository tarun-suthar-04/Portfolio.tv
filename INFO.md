# INFO.md — Tarun Suthar / Visual Works

> Purpose: A single source of truth for an AI IDE, coding agent, or model working on this portfolio.
> Read this file before changing portfolio copy, project metadata, layout, SEO, or assets.
> Do not invent missing personal details, client relationships, project dates, credentials, or social links.

## 1. Portfolio Identity

- **Name:** Tarun Suthar
- **Brand:** TARUN / VISUAL WORKS
- **Portfolio type:** Creative-first portfolio for AI-assisted visual creation, moving images, digital design, and content production.
- **Primary positioning:** Creative AI Artist & Visual Content Creator
- **Target roles:**
  - AI Video Creator
  - AI Content Creator
  - AI Visual Designer
  - Generative AI Artist
  - Creative Editor
  - Visual Content Creator
- **Public contact email:** cdstarun2004@gmail.com
- **Public location:** Not provided; do not infer or publish one.
- **Instagram:** Not provided.
- **Vimeo:** Not provided.
- **Production domain:** Not provided. Inspect existing project configuration/environment variables; do not guess a URL.
- **Availability statement:** “Open to creative opportunities” (use only if appropriate for the existing site).

## 2. Professional Summary

Suggested portfolio bio:

> I explore the possibilities of AI-assisted creativity, visual design, and moving images. My work spans AI-generated visuals, posters, portraits, advertising concepts, short-form video, and digital compositions. I combine creative experimentation with an understanding of color, composition, image layers, editing, and visual storytelling.

Suggested concise description:

> A creative portfolio exploring AI-generated imagery, AI video, editorial posters, portraits, advertising visuals, UGC-style content, and digital image-making.

These are proposed portfolio copy, not claims about years of experience, client work, qualifications, or professional employment.

## 3. Creative Capabilities

Use these as areas of interest and capability, not as proof of professional experience unless supported by actual portfolio work.

- AI video creation
- AI image generation
- Editorial and graphic poster design
- Portraits and wallpapers
- Advertising creatives and visual concepts
- UGC-style content
- Short-form video and visual storytelling
- Image editing and compositing
- Image layers and masking concepts
- Color theory and color grading
- Composition, framing, and visual hierarchy
- Digital content design
- Creative experimentation with AI tools

## 4. Tools

Tools known from the owner's stated interests:

- Canva
- CapCut
- Flow AI

Other AI and editing tools may be added only when the owner confirms them or when existing project files reliably establish their use.

**Project-level tool credits must be accurate.** Do not assume a tool was used for a particular project just because it appears in this list. Verify before displaying tools on project pages.

## 5. Design Direction

Preserve the existing portfolio's visual identity. Do not redesign the site from scratch.

- Dark, near-black background (existing theme reference: `#090909`)
- Minimal, editorial, image-first presentation
- Strong typography and generous negative space
- Precise grid alignment and consistent spacing
- Small uppercase metadata labels
- Restrained, professional visual language
- Keep images and videos as the main focus
- Avoid unnecessary gradients, clutter, generic template styling, and excessive UI decoration
- Maintain responsive behavior across desktop, tablet, and mobile
- Avoid changes that break existing archive layouts, image captions, media galleries, or project navigation

Suggested hero/brand copy:

- Brand: `TARUN / VISUAL WORKS`
- Descriptor: `INDEPENDENT CREATIVE PORTFOLIO`
- Headline: `Ideas into images. Images into stories.`
- Supporting line: `AI-generated visuals · Moving images · Editorial design · Digital content`
- Capability line: `AI VIDEO / IMAGE MAKING / POSTERS / PORTRAITS / ADS / UGC / VISUAL EDITING`
- Contact: `cdstarun2004@gmail.com`

Use or adapt these phrases to fit the existing component structure and design.

## 6. Current Projects

Important: Preserve these existing IDs, slugs, categories, and working media references. The descriptions below are suggested editorial copy based on project titles and the portfolio direction. They are not verified client histories. Keep years, clients, and credits absent until confirmed.

### Project 01 — Garment Studies

- **ID:** `01`
- **Slug:** `garment-studies`
- **Title:** `Garment Studies`
- **Category:** `Commercials`
- **Year:** Unknown / not supplied
- **Client:** Unconfirmed
- **Ownership:** Needs confirmation
- **Creative role / credits:** Needs confirmation
- **Suggested description:** A visual exploration of fashion, garment details, silhouettes, textures, and commercial imagery. Focused on visual composition, material presentation, and creating compelling fashion-led frames.
- **Tools:** Not verified; do not display project-level tool credits until confirmed.

### Project 02 — Moving Image

- **ID:** `02`
- **Slug:** `moving-image`
- **Title:** `Moving Image`
- **Category:** `Stories`
- **Year:** Unknown / not supplied
- **Client:** Unconfirmed
- **Ownership:** Needs confirmation
- **Creative role / credits:** Needs confirmation
- **Suggested description:** An exploration of moving images, visual rhythm, motion, framing, and atmosphere through short-form video experiments and cinematic visual sequences.
- **Potential tools mentioned by owner:** Flow AI, CapCut. Verify that each was actually used for this project before displaying credits.

### Project 03 — Image Making

- **ID:** `03`
- **Slug:** `image-making`
- **Title:** `Image Making`
- **Category:** `Personal`
- **Year:** Unknown / not supplied
- **Client:** Unconfirmed
- **Ownership:** Needs confirmation
- **Creative role / credits:** Needs confirmation
- **Suggested description:** A collection of visual experiments exploring AI-assisted imagery, portraits, graphic compositions, editorial posters, color, and digital image-making.
- **Potential tool mentioned by owner:** Canva. Verify actual project use before displaying project-level credits.

### Project metadata rules

- Keep `year`, `client`, `credits`, and `role` optional.
- Never invent project years, client names, collaborators, or roles.
- Do not label work “client work,” “commissioned,” or “commercially produced” unless confirmed.
- The `Commercials` category is an existing archive category; it does not prove that a named client commissioned the project.
- Hide metadata fields when their values are absent. Do not render empty labels such as `YEAR —` or `CLIENT —`.
- Keep current project slugs and media paths stable unless the owner authorizes a migration.
- Verify descriptions against actual project media before publishing.

## 7. Suggested TypeScript Data Shape

Adapt this to the existing source files and exports rather than replacing the application's required schema blindly.

```ts
export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description?: string;
  year?: number;
  client?: string;
  credits?: string[];
  role?: string;
  tools?: string[];
};
```

Example optional rendering logic for a project detail component:

```tsx
{project.year != null && <p>{project.year}</p>}

{project.description && <p>{project.description}</p>}

{project.client && <p>Client — {project.client}</p>}

{project.credits?.length ? (
  <p>Credits — {project.credits.join(", ")}</p>
) : null}
```

Treat these snippets as guidance. Follow the actual framework, component, type, and styling conventions in the repository.

## 8. Suggested `site.ts` Content

Use this as a content reference and adapt the shape to the existing `src/data/site.ts` implementation.

```ts
export const site = {
  name: "Tarun Suthar",
  brand: "TARUN / VISUAL WORKS",
  title: "Creative AI Artist & Visual Content Creator",
  description:
    "A creative portfolio exploring AI-generated imagery, AI video, editorial posters, portraits, advertising visuals, UGC-style content, and digital image-making.",
  email: "cdstarun2004@gmail.com",

  // Unknown public details must remain absent or optional.
  // Do not infer a location, Instagram handle, Vimeo handle, or domain.
  location: undefined,
  instagram: undefined,
  vimeo: undefined,

  specialties: [
    "AI Video Creation",
    "AI Image Generation",
    "Poster & Editorial Design",
    "Portraits & Wallpapers",
    "Advertising Creatives",
    "UGC-Style Content",
    "Visual Storytelling",
    "Image Editing & Compositing",
    "Color Theory",
    "Digital Content Design",
  ],

  tools: ["Canva", "CapCut", "Flow AI"],

  about:
    "I explore the possibilities of AI-assisted creativity, visual design, and moving images. My work spans AI-generated visuals, posters, portraits, advertising concepts, short-form video, and digital compositions. I combine creative experimentation with an understanding of color, composition, image layers, editing, and visual storytelling.",

  availability: "Open to creative opportunities",
  socialLinks: [],
} as const;
```

**Schema warning:** `undefined` is only suitable if the existing application supports optional values. If the code expects a different schema, omit unknown properties or follow the project's established nullable-field convention. Do not replace existing exports or fields without checking their consumers.

## 9. AI IDE / Coding Agent Instructions

When implementing changes:

1. Read this `INFO.md` and inspect the repository before editing.
2. Inspect `src/data/site.ts` (or the actual site configuration), `src/data/projects.ts`, project detail routes, layout metadata, existing assets, and relevant components.
3. Preserve the existing app architecture, data exports, IDs, slugs, media references, styling conventions, and responsive layout.
4. Update the site positioning to emphasize creative AI work, visual content, moving images, editing, and design.
5. Use the confirmed email exactly: `cdstarun2004@gmail.com`.
6. Keep unknown location, social links, domain, project years, client names, and credits unpublished.
7. Add optional project descriptions and conditionally render metadata only when values exist.
8. Verify all project descriptions and tool credits against the actual media and owner-provided facts before treating them as factual.
9. Do not invent professional experience, qualifications, awards, client relationships, or project results.
10. Do not rename media assets without checking and updating all references. Avoid breaking image/video URLs.
11. Preserve the dark editorial visual identity, image-first presentation, caption alignment, and responsive behavior.
12. If improving SEO, icons, robots, sitemap, or Open Graph metadata, use only a confirmed production URL. If the domain is unavailable, leave domain-dependent configuration clearly pending instead of guessing.
13. Run available lint, type-check, and production-build commands.
14. Report changed files, implementation decisions, test results, and any information still required from the owner.

## 10. Launch-Readiness Checklist

### Content
- [x] Name and portfolio brand supplied
- [x] Public email supplied
- [x] Creative portfolio positioning defined
- [x] Initial descriptions drafted for three existing projects
- [ ] Confirm whether each project is personal, collaborative, or client work
- [ ] Confirm project years, roles, clients, and collaborators where applicable
- [ ] Verify which tools were used for each project
- [ ] Confirm public location only if the owner wants it displayed
- [ ] Add Instagram/Vimeo links only if supplied
- [ ] Confirm production domain

### Technical
- [ ] Ensure project detail metadata renders conditionally
- [ ] Create matching favicon and app icons if missing
- [ ] Add a custom editorial 404 page if missing
- [ ] Configure `metadataBase` once the production domain is confirmed
- [ ] Add `robots.ts` and `sitemap.ts` using the confirmed domain and valid routes
- [ ] Add an Open Graph image consistent with the portfolio's visual identity
- [ ] Use accurate, descriptive alt text for each image/video
- [ ] Rename temporary assets only after checking every reference
- [ ] Test archive captions, galleries, navigation, and responsive layouts
- [ ] Run lint, type checks, and production build

## 11. Source-of-Truth Rules

If this file conflicts with the current implementation:

- Preserve the working application architecture unless a change is explicitly needed.
- Use the repository to verify technical facts such as route names, component APIs, existing exports, and asset references.
- Use owner-confirmed facts for biography, project ownership, clients, dates, credits, and tool usage.
- Treat descriptions and taglines marked “suggested” as editable draft copy, not verified project facts.
- When information is missing, leave it optional and report the gap. Never fill it with a guess.
