import { MediaWall } from "@/components/media-wall";
import { projects } from "@/data/projects";

export default function HomePage() {
  return <MediaWall projects={projects.filter((project) => project.featured)} heading="Featured work" />;
}
