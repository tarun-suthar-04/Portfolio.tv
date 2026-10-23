import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const db = await createClient();
  if (!db) return null;

  const [all, published, drafts, categories, media, recent] = await Promise.all([
    db.from("projects").select("id", { count: "exact", head: true }),
    db.from("projects").select("id", { count: "exact", head: true }).eq("status", "published"),
    db.from("projects").select("id", { count: "exact", head: true }).eq("status", "draft"),
    db.from("categories").select("id", { count: "exact", head: true }),
    db.from("project_media").select("id", { count: "exact", head: true }),
    db.from("projects").select("id, title, slug, status, updated_at").order("updated_at", { ascending: false }).limit(6),
  ]);

  const stats = [
    { label: "Total Projects", value: all.count ?? 0 },
    { label: "Published", value: published.count ?? 0 },
    { label: "Drafts", value: drafts.count ?? 0 },
    { label: "Categories", value: categories.count ?? 0 },
    { label: "Media Assets", value: media.count ?? 0 },
  ];

  return (
    <div className="admin-dashboard-page">
      <header className="admin-heading">
        <p className="eyebrow">PORTFOLIO MANAGEMENT</p>
        <div className="admin-heading-title-row">
          <div>
            <h1>Overview</h1>
            <p className="admin-subtitle">
              Supabase CMS status, project metrics, and quick actions.
            </p>
          </div>
          <Link className="admin-cta" href="/admin/projects/new">
            + Add New Work
          </Link>
        </div>
      </header>

      {/* Metric Stat Tiles */}
      <section className="admin-stats" aria-label="Portfolio Statistics">
        {stats.map((stat) => (
          <article key={stat.label} className="admin-stat-card">
            <span className="admin-stat-label">{stat.label}</span>
            <strong className="admin-stat-value">{stat.value}</strong>
          </article>
        ))}
      </section>

      {/* Recently Updated Projects */}
      <section className="admin-section">
        <div className="admin-section-heading">
          <h2>Recently Updated Projects</h2>
          <Link href="/admin/projects" className="admin-view-all-link">
            All projects ↗
          </Link>
        </div>

        {recent.data?.length ? (
          <div className="admin-table-container">
            <div className="admin-table-header admin-dashboard-row">
              <span>PROJECT</span>
              <span>STATUS</span>
              <span>UPDATED</span>
              <span className="admin-th-actions">ACTION</span>
            </div>

            <div className="admin-table">
              {recent.data.map((p) => (
                <div className="admin-row admin-dashboard-row" key={p.id}>
                  <div className="project-list-meta">
                    <strong>{p.title}</strong>
                    <small className="project-list-sub">/{p.slug}</small>
                  </div>

                  <div>
                    <span
                      className={`admin-status-pill ${
                        p.status === "published" ? "is-published" : "is-draft"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <span className="admin-dashboard-date">
                    {new Date(p.updated_at).toLocaleDateString()}
                  </span>

                  <div className="admin-row-actions">
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="admin-action-btn admin-action-edit"
                    >
                      Edit ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="admin-empty-state">
            <p>No projects yet.</p>
            <Link href="/admin/projects/new">Add your first project →</Link>
          </div>
        )}
      </section>

      {/* Quick Action Shortcuts */}
      <section className="admin-quick-section">
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="admin-quick-grid">
          <Link href="/admin/projects/new" className="admin-quick-card">
            <strong>Add New Work</strong>
            <span>Create a project and upload media</span>
          </Link>
          <Link href="/admin/categories" className="admin-quick-card">
            <strong>Manage Categories</strong>
            <span>Add or edit archive sections</span>
          </Link>
          <Link href="/admin/media" className="admin-quick-card">
            <strong>Media Library</strong>
            <span>Browse and inspect all stored assets</span>
          </Link>
          <Link href="/" target="_blank" className="admin-quick-card">
            <strong>Live Portfolio ↗</strong>
            <span>View public site in a new tab</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
