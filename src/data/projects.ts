export type MediaItem = {
  src: string;
  type: "image" | "video";
  alt: string;
  poster?: string;
  width: number;
  height: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug?: string;
  cover: MediaItem;
  media: MediaItem[];
  order: number;
  year?: string | number;
  description?: string;
  credits?: Array<{ role: string; name: string }>;
  featured?: boolean;
};

// Content is served from Supabase. No local media manifest remains.
export const projects: Project[] = [];
export const categories = ["Stories", "Commercials", "Personal"] as const;
export const projectBySlug = (slug: string) => projects.find((project) => project.slug === slug);
