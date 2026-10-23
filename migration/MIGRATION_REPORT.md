# Existing content migration report

**Status: source validation complete; schema connected; legacy content import pending.** Supabase project `kegafxkikhxhgdfhdzwm` has the CMS schema and policies applied. It currently has 3 starter categories and no imported projects/media.

## Connected backend

- API URL and publishable key are configured locally in the ignored `.env.local`.
- Applied migrations: `20261022151231_cms_schema` and `20261022151524_admin_policy_index_tuning`.
- The `portfolio-media` Storage bucket is private, allows JPEG/PNG/WebP/AVIF/MP4/WebM, and limits each object to 500 MB.
- Security advisor returned no findings. Performance advisor now reports only unused-index notices on the empty database.
- No administrator account is allowlisted yet. Create the owner account through Supabase Auth and add its UUID to `public.admin_users` before login.

## Source snapshot

- Original project manifest backup: [`projects.ts.bak`](projects.ts.bak).
- Existing project records: 3 (`garment-studies`, `moving-image`, `image-making`).
- Existing categories: Stories, Commercials, Personal.
- Manifest-referenced media and video posters: 23 unique files. The dry-run confirmed all 23 exist in `public/media/`, including the filename containing a space.
- Assets in `work/` and `public/media/` have not been moved or deleted.
- Detailed byte inventory and validation timestamp: [`import-report.json`](import-report.json).

## Import behavior

`scripts/import-portfolio.mjs --dry-run` validates referenced files without network writes. Running it without `--dry-run` requires `SUPABASE_URL` and the server-only `SUPABASE_SECRET_KEY`. It upserts the initial categories, projects by slug, media by Storage path and cover references; it uploads files into `portfolio-media/legacy/<project-slug>/`. It can be rerun after an interrupted import.

## Cutover checklist

1. Back up the target Supabase project.
2. Apply the versioned SQL migration and provision the admin allowlist.
3. Run and review the import report; verify project/category/media counts and sample public URLs.
4. Configure the production host environment, then deploy the CMS capable Node runtime.
5. Verify every existing project route and category archive before traffic cutover.

Do not delete legacy local assets after import; keep them as the recovery copy.
