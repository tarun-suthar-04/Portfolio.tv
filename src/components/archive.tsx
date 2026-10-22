import type { Project } from "@/data/projects";
import { MediaWall } from "@/components/media-wall";

export function Archive({ items, title }: { title: string; items: Project[] }) {
  return <MediaWall projects={items} heading={title} />;
}
