/* eslint-disable @next/next/no-img-element -- signed media URLs use the CMS route directly */
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { retryStorageCleanup } from "@/app/admin/actions";
import CopyMediaUrl from "@/app/admin/copy-media-url";

export const dynamic = "force-dynamic";

type Search = Promise<{
  q?: string;
  type?: string;
  sort?: string;
  page?: string;
}>;

export default async function MediaLibrary({ searchParams }: { searchParams: Search }) {
  const params = await searchParams;
  const db = await createClient();
  if (!db) return null;

  const page = Math.max(1, Number(params.page) || 1);
  const size = 48;

  let query = db
    .from("project_media")
    .select("*, projects(id, title, slug, cover_media_id)", { count: "exact" });

  if (params.q) {
    query = query.ilike("storage_path", `%${params.q.replace(/[%_,]/g, "\\$&")}%`);
  }
  if (params.type === "image" || params.type === "video") {
    query = query.eq("media_type", params.type);
  }

  query = query.order("created_at", { ascending: params.sort === "oldest" });

  const [{ data, count }, { data: cleanup }] = await Promise.all([
    query.range((page - 1) * size, page * size - 1),
    db
      .from("storage_cleanup_queue")
      .select("id, storage_paths, failure_message, created_at")
      .is("resolved_at", null)
      .order("created_at"),
  ]);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / size));
  const withPage = (n: number) =>
    `?${new URLSearchParams({ ...params, page: String(n) }).toString()}`;

  return (
    <div className="admin-media-library">
      <header className="admin-heading">
        <p className="eyebrow">ASSET ARCHIVE</p>
        <div className="admin-heading-title-row">
          <div>
            <h1>Media Library</h1>
            <p className="admin-subtitle">
              {count ?? 0} total uploaded assets stored in Supabase Storage.
            </p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <form method="get" className="admin-filters">
        <label>
          <span>Filename / Path</span>
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search path..."
          />
        </label>
        <label>
          <span>Media Type</span>
          <select name="type" defaultValue={params.type ?? ""}>
            <option value="">All Media Types</option>
            <option value="image">Images (Still)</option>
            <option value="video">Videos (Moving)</option>
          </select>
        </label>
        <label>
          <span>Upload Date</span>
          <select name="sort" defaultValue={params.sort ?? "newest"}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </label>
        <div className="admin-filter-actions">
          <button type="submit" className="admin-btn-secondary">
            Filter Assets
          </button>
          {(params.q || params.type || params.sort) && (
            <Link href="/admin/media" className="admin-btn-text">
              Clear
            </Link>
          )}
        </div>
      </form>

      {/* Grid of Media Assets */}
      <div className="admin-media-grid">
        {data?.map((m) => {
          const src = `/cms-media/${m.storage_path}`;
          const poster = m.thumbnail_path ? `/cms-media/${m.thumbnail_path}` : undefined;
          const usedBy = Array.isArray(m.projects) ? m.projects[0] : m.projects;
          const isCover = usedBy?.cover_media_id === m.id;
          const isVideo = m.media_type === "video";

          return (
            <article key={m.id} className="admin-media-card">
              <div className="admin-media-card-preview">
                {isVideo ? (
                  <video
                    src={src}
                    poster={poster}
                    controls
                    preload="none"
                    className="admin-media-element"
                  />
                ) : (
                  <img
                    src={src}
                    alt={m.alt_text || "Storage asset"}
                    className="admin-media-element"
                  />
                )}

                <div className="admin-card-badges">
                  <span className="admin-badge-type">{isVideo ? "VIDEO" : "STILL"}</span>
                  {isCover && <span className="admin-badge-cover">★ COVER</span>}
                </div>
              </div>

              <div className="admin-media-card-body">
                <h3 className="admin-media-filename" title={m.alt_text || m.storage_path}>
                  {m.alt_text || m.storage_path.split("/").pop()}
                </h3>

                <div className="admin-media-specs">
                  <span>{m.width && m.height ? `${m.width}×${m.height}` : "HD"}</span>
                  <span>
                    • {m.file_size ? `${(m.file_size / (1024 * 1024)).toFixed(1)} MB` : "size n/a"}
                  </span>
                </div>

                {usedBy?.title ? (
                  <p className="admin-media-linked">
                    Project:{" "}
                    <Link href={`/admin/projects/${usedBy.id}/edit`}>
                      {usedBy.title} ↗
                    </Link>
                  </p>
                ) : (
                  <p className="admin-media-linked">Unlinked asset</p>
                )}

                <code className="admin-media-path" title={m.storage_path}>
                  {m.storage_path}
                </code>

                <div className="admin-media-card-footer">
                  <CopyMediaUrl path={m.storage_path} />
                  <span className="admin-media-date">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {!data?.length && (
        <div className="admin-empty-state">
          <p>No matching media assets found.</p>
          <small>Try clearing or adjusting your search filters.</small>
        </div>
      )}

      {/* Pagination */}
      <nav className="admin-pagination">
        <span>
          Page {page} of {totalPages} • {count ?? 0} total assets
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

      {/* Storage Cleanup Queue */}
      {!!cleanup?.length && (
        <section className="admin-section admin-cleanup-section">
          <h2>Storage Cleanup Queue ({cleanup.length})</h2>
          <p className="admin-section-sub">
            Files marked for deletion that failed during automatic storage pruning. Retry below.
          </p>

          <div className="admin-cleanup-list">
            {cleanup.map((item) => (
              <div key={item.id} className="admin-cleanup-item">
                <div>
                  <strong>{item.storage_paths.length} file(s) pending removal</strong>
                  <p className="admin-cleanup-error">{item.failure_message}</p>
                  <small className="admin-cleanup-date">
                    Failed on {new Date(item.created_at).toLocaleString()}
                  </small>
                </div>

                <form action={retryStorageCleanup}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="admin-btn-secondary">
                    Retry Cleanup
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
