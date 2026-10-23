import { MediaWall } from "@/components/media-wall";
import { getFeaturedProjects } from "@/lib/content";
export const dynamic="force-dynamic";
export default async function HomePage() { return <MediaWall projects={await getFeaturedProjects()} heading="Featured work" />; }
