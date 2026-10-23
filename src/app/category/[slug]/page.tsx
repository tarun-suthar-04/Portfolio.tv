import { notFound } from "next/navigation";
import { Archive } from "@/components/archive";
import { getCategories,getCategoryProjects } from "@/lib/content";
export const dynamic="force-dynamic";
export default async function GenericCategory({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const category=(await getCategories()).find(c=>c.slug===slug); if(!category) notFound();
 return <Archive title={category.name} items={await getCategoryProjects(slug)} />;
}
