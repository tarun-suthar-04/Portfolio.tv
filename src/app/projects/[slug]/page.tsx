import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/content";
import { MediaView } from "@/components/media-view";
import { site } from "@/data/site";

export const dynamic="force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description ?? `${project.title} — ${project.category} by ${site.name}.`,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const ordered = [...await getProjects()].sort((a, b) => a.order - b.order);
  const index = ordered.findIndex((item) => item.slug === project.slug);
  const next = ordered[(index + 1) % ordered.length];

  return (
    <main className="page-shell project-page">
      <div className="project-title-row">
        <div>
          <span className="eyebrow">{project.category}</span>
          <h1>{project.title}</h1>
        </div>
        <Link
          href={project.categorySlug === "stories" || project.categorySlug === "commercials" || project.categorySlug === "personal" ? `/${project.categorySlug}` : `/category/${project.categorySlug ?? project.category.toLowerCase()}`}
          className="text-link"
        >
          Back to archive <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {(project.year || project.description || project.credits?.length) && (
        <div className="project-meta">
          {project.year && <span>{project.year}</span>}
          {project.description && <p>{project.description}</p>}
          {project.credits?.map((credit) => (
            <span key={`${credit.role}-${credit.name}`}>
              {credit.role} — {credit.name}
            </span>
          ))}
        </div>
      )}

      <div className="project-gallery">
        {project.media.map((item, itemIndex) => (
          <div
            className={`gallery-item gallery-item-${itemIndex % 3}${item.type === "video" ? " gallery-video" : ""}`}
            key={`${project.id}-${item.src}`}
          >
            <figure className="gallery-frame">
              <MediaView item={item} />
              <figcaption>
                <span>{item.type === "video" ? "Moving image" : "Still"}</span>
                <span>{String(itemIndex + 1).padStart(2, "0")}</span>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>

      <nav className="next-project" aria-label="Project navigation">
        <span className="eyebrow">Next project</span>
        <Link href={`/projects/${next.slug}`}>
          <span>{next.title}</span>
          <b aria-hidden="true">↗</b>
        </Link>
      </nav>
    </main>
  );
}
