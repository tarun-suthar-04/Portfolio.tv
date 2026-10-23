/* eslint-disable @next/next/no-img-element -- preview uses signed private media URLs. */
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PreviewProps {
  params: Promise<{ id: string }>;
}

export default async function Preview({ params }: PreviewProps) {
  const { id } = await params;
  const db = await createClient();
  if (!db) return null;

  const { data: project } = await db
    .from("projects")
    .select("*, categories(name, slug), project_media(*)")
    .eq("id", id)
    .maybeSingle();

  if (!project) notFound();

  const items = [...(project.project_media ?? [])].sort(
    (a, b) => a.display_order - b.display_order
  );

  const categoryName = (Array.isArray(project.categories)
    ? project.categories[0]?.name
    : (project.categories as unknown as { name: string } | null)?.name) ?? "Uncategorized";

  return (
    <main className="page-shell project-page admin-preview-container">
      {/* Admin Floating Banner */}
      <div className="admin-preview-bar">
        <span>
          ADMIN PREVIEW • <strong>{project.status.toUpperCase()}</strong>
          {project.is_featured && " • FEATURED"}
        </span>
        <Link href={`/admin/projects/${project.id}/edit`} className="admin-btn-secondary">
          ← Back to Editor
        </Link>
      </div>

      <div className="project-title-row">
        <div>
          <span className="eyebrow">{categoryName}</span>
          <h1>{project.title}</h1>
        </div>
      </div>

      {(project.year || project.description || project.credits?.length) && (
        <div className="project-meta">
          {project.year && <span>{project.year}</span>}
          {project.description && <p>{project.description}</p>}
          {project.credits?.map((credit: { role: string; name: string }) => (
            <span key={`${credit.role}-${credit.name}`}>
              {credit.role} — {credit.name}
            </span>
          ))}
        </div>
      )}

      <div className="project-gallery">
        {items.map((item, itemIndex) => {
          const isVideo = item.media_type === "video";
          const src = `/cms-media/${item.storage_path}`;
          const poster = item.thumbnail_path ? `/cms-media/${item.thumbnail_path}` : undefined;

          return (
            <div
              className={`gallery-item gallery-item-${itemIndex % 3}${isVideo ? " gallery-video" : ""}`}
              key={item.id}
            >
              <figure className="gallery-frame">
                {isVideo ? (
                  <video
                    className="media-video"
                    src={src}
                    poster={poster}
                    controls
                    preload="none"
                  />
                ) : (
                  <img
                    className="media-image"
                    src={src}
                    alt={item.alt_text || "Project asset"}
                  />
                )}
                <figcaption>
                  <span>{isVideo ? "Moving image" : "Still"}</span>
                  <span>{String(itemIndex + 1).padStart(2, "0")}</span>
                </figcaption>
              </figure>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="admin-empty-state">
          <p>No media assets uploaded to this project yet.</p>
          <Link href={`/admin/projects/${project.id}/edit`}>
            Add media in editor →
          </Link>
        </div>
      )}
    </main>
  );
}
