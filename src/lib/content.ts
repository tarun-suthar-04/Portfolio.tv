import { unstable_noStore as noStore } from "next/cache";
import type { MediaItem, Project } from "@/data/projects";
import { projects as initialProjects } from "@/data/projects";
import { createClient } from "@/lib/supabase/server";

type DbMedia = { id: string; media_type: "image" | "video"; storage_path: string; thumbnail_path: string | null; alt_text: string; width: number | null; height: number | null; display_order: number };
type DbProject = { id: string; slug: string; title: string; description: string; year: string | null; credits: Array<{role:string;name:string}>; status: string; is_featured: boolean; display_order: number; cover_media_id: string | null; category: {name:string;slug:string} | null; project_media: DbMedia[] };
function publicUrl(path: string) {
  return `/cms-media/${path.split("/").map(encodeURIComponent).join("/")}`;
}
function mapProject(row: DbProject): Project {
  const ordered = [...(row.project_media ?? [])].sort((a,b)=>a.display_order-b.display_order);
  const media: MediaItem[] = ordered.map(m=>({
    src: publicUrl(m.storage_path), type: m.media_type, alt: m.alt_text, width: m.width ?? 1200, height: m.height ?? 800,
    poster: m.thumbnail_path ? publicUrl(m.thumbnail_path) : undefined,
  }));
  const coverIndex = ordered.findIndex(m=>m.id===row.cover_media_id);
  return { id: row.id, slug: row.slug, title: row.title, category: row.category?.name ?? "Work", categorySlug: row.category?.slug, cover: media[coverIndex >= 0 ? coverIndex : 0], media, order: row.display_order, year: row.year ?? undefined, description: row.description || undefined, credits: row.credits ?? [], featured: row.is_featured };
}
async function loadProjects(filter?: {categorySlug?:string; featured?:boolean}) {
  noStore();
  const supabase = await createClient();
  if (!supabase) return process.env.NODE_ENV === "production" ? [] : initialProjects.filter(p=>(!filter?.categorySlug || p.category.toLowerCase()===filter.categorySlug) && (!filter?.featured || p.featured));
  let query = supabase.from("projects").select("*, category:categories!inner(name,slug), project_media:project_media!project_media_project_id_fkey(*)").eq("status","published").order("display_order");
  if (filter?.categorySlug) query = query.eq("category.slug",filter.categorySlug);
  if (filter?.featured) query = query.eq("is_featured",true);
  const {data,error}=await query;
  if(error) { console.error("CMS content query failed",error.message); return []; }
  return ((data ?? []) as unknown as DbProject[]).map(mapProject).filter(p=>p.media.length>0);
}
export const getProjects = () => loadProjects();
export const getFeaturedProjects = () => loadProjects({featured:true});
export const getCategoryProjects = (slug:string) => loadProjects({categorySlug:slug});
export async function getProjectBySlug(slug:string) { return (await loadProjects()).find(p=>p.slug===slug); }
export async function getCategories() {
  noStore();
  const supabase=await createClient();
  if(!supabase) return process.env.NODE_ENV === "production" ? [] : [{name:"Personal",slug:"personal"},{name:"Commercials",slug:"commercials"},{name:"Stories",slug:"stories"}];
  const {data,error}=await supabase.from("categories").select("name,slug").order("display_order");
  if(error) return [];
  return data ?? [];
}
