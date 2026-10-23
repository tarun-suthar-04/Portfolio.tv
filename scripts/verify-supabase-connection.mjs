import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.trimStart().startsWith("#"))
    .map((line) => {
      const normalized = line.replace(/^\uFEFF/, "");
      const separator = normalized.indexOf("=");
      return [normalized.slice(0, separator), normalized.slice(separator + 1)];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("Supabase URL or publishable key is missing from .env.local");

async function request(path, init = {}) {
  return fetch(new URL(path, url), {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(init.headers ?? {}),
    },
  });
}

const publicProjectSelect = "slug,category:categories!inner(name,slug),project_media:project_media!project_media_project_id_fkey(id)";
const adminProjectSelect = "id,title,categories(name),project_media:project_media!project_media_project_id_fkey(id),cover:project_media!projects_cover_media_id_fkey(storage_path,media_type,thumbnail_path)";

const [categoriesResponse, projectsResponse, publicEmbedResponse, adminEmbedResponse, adminResponse] = await Promise.all([
  request("/rest/v1/categories?select=slug&order=display_order.asc"),
  request("/rest/v1/projects?select=slug&status=eq.published"),
  request(`/rest/v1/projects?select=${encodeURIComponent(publicProjectSelect)}&status=eq.published`),
  request(`/rest/v1/projects?select=${encodeURIComponent(adminProjectSelect)}`),
  request("/rest/v1/admin_users?select=user_id"),
]);

if (!categoriesResponse.ok) throw new Error(`Category read failed: ${categoriesResponse.status}`);
if (!projectsResponse.ok) throw new Error(`Published project read failed: ${projectsResponse.status}`);
if (!publicEmbedResponse.ok) throw new Error(`Public project relation embed failed: ${await publicEmbedResponse.text()}`);
if (!adminEmbedResponse.ok) throw new Error(`Admin project relation embeds failed: ${await adminEmbedResponse.text()}`);
if (adminResponse.status !== 401 && adminResponse.status !== 403) {
  throw new Error(`Expected anonymous admin_users access to be denied, got ${adminResponse.status}`);
}

const categories = await categoriesResponse.json();
const projects = await projectsResponse.json();
for (const slug of ["stories", "commercials", "personal"]) {
  if (!categories.some((category) => category.slug === slug)) {
    throw new Error(`Expected starter category is missing: ${slug}`);
  }
}

console.log(
  `Supabase connection verified: ${categories.length} categories, ${projects.length} published projects; anonymous admin table access denied.`,
);
