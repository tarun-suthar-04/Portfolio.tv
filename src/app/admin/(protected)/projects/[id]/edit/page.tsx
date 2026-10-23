/* eslint-disable @next/next/no-img-element -- Supabase signed media URLs are displayed directly */
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { saveProject, setCover, deleteProject } from "@/app/admin/actions";
import UploadMedia from "@/app/admin/upload-media";
import ProjectIdentity from "@/app/admin/project-identity";
import MediaControls from "@/app/admin/media-controls";
import ConfirmForm from "@/app/admin/confirm-form";
import UnsavedGuard from "@/app/admin/unsaved-guard";

export const dynamic = "force-dynamic";

interface EditProjectProps {
  params: Promise<{ id: string }>;
}

export default async function EditProject({ params }: EditProjectProps) {
  const { id } = await params;
  const db = await createClient();
  if (!db) return null;

  const [{ data: project }, { data: categories }, { data: media }] = await Promise.all([
    db.from("projects").select("*, categories(name, slug)").eq("id", id).maybeSingle(),
    db.from("categories").select("id, name").order("display_order"),
    db.from("project_media").select("*").eq("project_id", id).order("display_order"),
  ]);

  if (!project) notFound();

  const ids = (media ?? []).map((m) => m.id);
  const categoryName = (Array.isArray(project.categories)
    ? project.categories[0]?.name
    : (project.categories as unknown as { name: string } | null)?.name) ?? "Uncategorized";

  return (
    <div className="admin-edit-project">
      {/* Header with Navigation and Preview link */}
      <header className="admin-heading">
        <div className="admin-heading-breadcrumbs">
          <Link href="/admin/projects" className="admin-back-link">
            ← Projects
          </Link>
          <span className="admin-heading-sep">/</span>
          <span className="admin-heading-meta">{categoryName}</span>
        </div>

        <div className="admin-heading-title-row">
          <div>
            <h1>{project.title}</h1>
            <p className="admin-subtitle">
              Slug: <code>/{project.slug}</code> • Status:{" "}
              <span className={`admin-status-pill ${project.status === "published" ? "is-published" : "is-draft"}`}>
                {project.status.toUpperCase()}
              </span>
              {project.is_featured && <span className="admin-featured-pill">FEATURED</span>}
            </p>
          </div>

          <div className="admin-heading-actions">
            <Link
              href={`/admin/preview/${project.id}`}
              target="_blank"
              className="admin-btn-secondary"
            >
              Preview Project ↗
            </Link>
            {project.status === "published" && (
              <Link
                href={`/projects/${project.slug}`}
                target="_blank"
                className="admin-btn-secondary"
              >
                View Live ↗
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Project Metadata Editor */}
      <UnsavedGuard>
        <form action={saveProject} className="admin-form">
          <input type="hidden" name="id" value={project.id} />

          <div className="admin-form-section">
            <h2 className="admin-section-title">Project Details</h2>

            <ProjectIdentity title={project.title} slug={project.slug} />

            <div className="admin-form-grid">
              <label>
                <span>Category</span>
                <select name="category_id" defaultValue={project.category_id} required>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Year / Date</span>
                <input
                  name="year"
                  defaultValue={project.year ?? ""}
                  placeholder="e.g. 2025 or 2024–2025"
                />
              </label>
            </div>

            <label>
              <span>Description / Story</span>
              <textarea
                name="description"
                rows={4}
                defaultValue={project.description ?? ""}
                placeholder="Editorial narrative or project context..."
              />
            </label>

            <label>
              <span>Credits &amp; Roles</span>
              <textarea
                name="credits"
                rows={3}
                defaultValue={(project.credits ?? [])
                  .map((c: { role: string; name: string }) => `${c.role} — ${c.name}`)
                  .join("\n")}
                placeholder="Creative Direction — Tarun Suthar&#10;Motion Design — John Doe"
              />
              <small className="admin-field-hint">One per line: Role — Name</small>
            </label>

            <div className="admin-form-grid">
              <label>
                <span>Display Order</span>
                <input
                  name="display_order"
                  type="number"
                  defaultValue={project.display_order}
                />
                <small className="admin-field-hint">Lower numbers appear first</small>
              </label>

              <label>
                <span>Publishing Status</span>
                <select name="status" defaultValue={project.status}>
                  <option value="draft">Draft (Hidden from public site)</option>
                  <option value="published">Published (Live in archive)</option>
                </select>
              </label>
            </div>

            <label className="admin-checkbox-label">
              <input
                name="is_featured"
                type="checkbox"
                defaultChecked={project.is_featured}
              />
              <span>Feature on homepage media wall</span>
            </label>

            <div className="admin-form-actions">
              <button type="submit" className="admin-cta">
                Save Project Changes
              </button>
            </div>
          </div>
        </form>
      </UnsavedGuard>

      {/* Media Management Section */}
      <section className="admin-section admin-media-section">
        <div className="admin-section-header">
          <div>
            <h2>Project Media ({media?.length ?? 0})</h2>
            <p className="admin-section-sub">
              Drag to reorder, set primary cover, or upload new high-resolution video and photo assets.
            </p>
          </div>
        </div>

        {/* Upload Dropzone */}
        <UploadMedia projectId={id} />

        {/* Existing Media Gallery Grid */}
        {media && media.length > 0 ? (
          <div className="admin-media-grid">
            {media.map((item, index) => {
              const isCover = project.cover_media_id === item.id;
              const isVideo = item.media_type === "video";
              const src = `/cms-media/${item.storage_path}`;
              const poster = item.thumbnail_path ? `/cms-media/${item.thumbnail_path}` : undefined;

              return (
                <article
                  key={item.id}
                  className={`admin-media-card ${isCover ? "is-cover-media" : ""}`}
                >
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
                        alt={item.alt_text || "Project asset"}
                        className="admin-media-element"
                      />
                    )}

                    {/* Overlay Badges */}
                    <div className="admin-card-badges">
                      <span className="admin-badge-pos">#{String(index + 1).padStart(2, "0")}</span>
                      <span className="admin-badge-type">{isVideo ? "VIDEO" : "STILL"}</span>
                      {isCover && <span className="admin-badge-cover">★ COVER</span>}
                    </div>
                  </div>

                  <div className="admin-media-card-body">
                    <p className="admin-media-filename" title={item.alt_text || item.storage_path}>
                      {item.alt_text || item.storage_path.split("/").pop()}
                    </p>

                    <div className="admin-media-specs">
                      <span>{item.width && item.height ? `${item.width}×${item.height}` : "HD"}</span>
                      {item.file_size && (
                        <span>• {(item.file_size / (1024 * 1024)).toFixed(1)} MB</span>
                      )}
                    </div>

                    {/* Set as Cover action */}
                    <form action={setCover} className="admin-cover-form">
                      <input type="hidden" name="project_id" value={id} />
                      <input type="hidden" name="media_id" value={item.id} />
                      <button
                        type="submit"
                        className={`admin-cover-btn ${isCover ? "is-active" : ""}`}
                        disabled={isCover}
                      >
                        {isCover ? "✓ Current Cover" : "Make Cover"}
                      </button>
                    </form>

                    {/* Reorder and Delete controls */}
                    <MediaControls
                      projectId={id}
                      ids={ids}
                      index={index}
                      id={item.id}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="admin-empty-state">
            <p>No media attached to this project yet.</p>
            <small>Use the upload dropzone above to add photos or moving images.</small>
          </div>
        )}
      </section>

      {/* Danger Zone: Delete Project */}
      <section className="admin-section admin-danger-zone" id="delete">
        <h2>Delete Project</h2>
        <p className="admin-section-sub">
          Permanently remove this project and all its associated media assets from the database and storage bucket.
        </p>

        <ConfirmForm
          action={deleteProject}
          message={`Are you sure you want to delete "${project.title}" and all its media assets? This action is permanent.`}
        >
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="admin-danger">
            Delete Project Permanently
          </button>
        </ConfirmForm>
      </section>
    </div>
  );
}
