/* eslint-disable @next/next/no-img-element -- admin thumbnails use signed private media URLs. */
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { setProjectStatus, deleteProject } from "@/app/admin/actions";
import ConfirmForm from "@/app/admin/confirm-form";

export const dynamic = "force-dynamic";

type Search = Promise<{
  q?: string;
  category?: string;
  status?: string;
  sort?: string;
  page?: string;
}>;

export default async function ProjectsPage({ searchParams }: { searchParams: Search }) {
  const params = await searchParams;
  const db = await createClient();
  if (!db) return null;

  const page = Math.max(1, Number(params.page) || 1);
  const size = 25;

  let query = db
    .from("projects")
    .select(
      "id, title, slug, status, is_featured, display_order, updated_at, category_id, categories(name), project_media:project_media!project_media_project_id_fkey(id), cover:project_media!projects_cover_media_id_fkey(storage_path, media_type, thumbnail_path)",
      { count: "exact" }
    );

  if (params.q) {
    query = query.ilike("title", `%${params.q.replace(/[%_,]/g, "\\$&")}%`);
  }
  if (params.category) {
    query = query.eq("category_id", params.category);
  }
  if (params.status === "draft" || params.status === "published") {
    query = query.eq("status", params.status);
  }

  query =
    params.sort === "title"
      ? query.order("title")
      : params.sort === "date"
      ? query.order("updated_at", { ascending: false })
      : query.order("display_order");

  const [{ data, count }, { data: categories }] = await Promise.all([
    query.range((page - 1) * size, page * size - 1),
    db.from("categories").select("id, name").order("display_order"),
  ]);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / size));
  const withPage = (n: number) =>
    `?${new URLSearchParams({ ...params, page: String(n) }).toString()}`;

  return (
    <div className="admin-projects-page">
      <header className="admin-heading">
        <p className="eyebrow">PORTFOLIO WORK</p>
        <div className="admin-heading-title-row">
          <div>
            <h1>Projects</h1>
            <p className="admin-subtitle">
              {count ?? 0} total projects • Manage editorial artwork, commercial projects, and media assets.
            </p>
          </div>
          <Link className="admin-cta" href="/admin/projects/new">
            + New Project
          </Link>
        </div>
      </header>

      {/* Filter Bar */}
      <form method="get" className="admin-filters">
        <label>
          <span>Search</span>
          <input name="q" defaultValue={params.q} placeholder="Search title..." />
        </label>
        <label>
          <span>Category</span>
          <select name="category" defaultValue={params.category ?? ""}>
            <option value="">All Categories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Status</span>
          <select name="status" defaultValue={params.status ?? ""}>
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>
        <label>
          <span>Sort By</span>
          <select name="sort" defaultValue={params.sort ?? "order"}>
            <option value="order">Display Order</option>
            <option value="title">Title (A-Z)</option>
            <option value="date">Recently Updated</option>
          </select>
        </label>
        <div className="admin-filter-actions">
          <button type="submit" className="admin-btn-secondary">
            Apply Filters
          </button>
          {(params.q || params.category || params.status || params.sort) && (
            <Link href="/admin/projects" className="admin-btn-text">
              Clear
            </Link>
          )}
        </div>
      </form>

      {/* Projects Table */}
      <div className="admin-table-container">
        {/* Table Header */}
        <div className="admin-table-header admin-project-row">
          <span>PROJECT</span>
          <span>STATUS</span>
          <span>MEDIA</span>
          <span>UPDATED</span>
          <span className="admin-th-actions">ACTIONS</span>
        </div>

        <div className="admin-table">
          {data?.map((p) => {
            const cover = Array.isArray(p.cover) ? p.cover[0] : p.cover;
            const catName =
              (Array.isArray(p.categories)
                ? p.categories[0]?.name
                : (p.categories as unknown as { name: string } | null)?.name) ?? "Uncategorized";

            return (
              <div className="admin-row admin-project-row" key={p.id}>
                {/* Project Title & Cover Preview */}
                <div className="project-list-title">
                  <div className="project-list-thumb">
                    {cover ? (
                      <img
                        src={`/cms-media/${cover.thumbnail_path || cover.storage_path}`}
                        alt=""
                      />
                    ) : (
                      <div className="project-list-no-thumb">No cover</div>
                    )}
                  </div>
                  <div className="project-list-meta">
                    <strong className="project-list-name">{p.title}</strong>
                    <small className="project-list-sub">
                      /{p.slug} • {catName}
                    </small>
                  </div>
                </div>

                {/* Status */}
                <div className="project-list-status">
                  <span
                    className={`admin-status-pill ${
                      p.status === "published" ? "is-published" : "is-draft"
                    }`}
                  >
                    {p.status}
                  </span>
                  {p.is_featured && <span className="admin-featured-pill">Featured</span>}
                </div>

                {/* Media Count */}
                <div className="project-list-media-count">
                  <span>{p.project_media?.length ?? 0} assets</span>
                </div>

                {/* Updated Date */}
                <div className="project-list-date">
                  <span>{new Date(p.updated_at).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="admin-row-actions">
                  <Link
                    href={`/admin/preview/${p.id}`}
                    target="_blank"
                    className="admin-action-btn"
                    title="Live Preview"
                  >
                    Preview ↗
                  </Link>
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="admin-action-btn admin-action-edit"
                  >
                    Edit
                  </Link>

                  <form action={setProjectStatus} className="inline-form">
                    <input type="hidden" name="id" value={p.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={p.status === "published" ? "draft" : "published"}
                    />
                    <button
                      type="submit"
                      className="admin-action-btn"
                      title={p.status === "published" ? "Unpublish (Move to draft)" : "Publish (Make live)"}
                    >
                      {p.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  </form>

                  <ConfirmForm
                    action={deleteProject}
                    message={`Permanently delete "${p.title}" and its media?`}
                  >
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className="admin-action-btn admin-action-danger"
                      title="Delete project"
                    >
                      Delete
                    </button>
                  </ConfirmForm>
                </div>
              </div>
            );
          })}
        </div>

        {!data?.length && (
          <div className="admin-empty-state">
            <p>No matching projects found.</p>
            <small>Try adjusting your search criteria or add a new project.</small>
          </div>
        )}
      </div>

      {/* Pagination */}
      <nav className="admin-pagination">
        <span>
          Page {page} of {totalPages} • {count ?? 0} total projects
        </span>
        <div className="admin-pagination-links">
          {page > 1 && (
            <Link href={withPage(page - 1)} className="admin-btn-secondary">
              ← Previous
            </Link>
          )}
          {page < totalPages && (
            <Link href={withPage(page + 1)} className="admin-btn-secondary">
              Next →
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
