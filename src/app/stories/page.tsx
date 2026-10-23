import type { Metadata } from "next";
import { Archive } from "@/components/archive";
import { getCategoryProjects } from "@/lib/content";
export const dynamic="force-dynamic";

export const metadata: Metadata = {
  title: "Stories",
  description: "Documentary and editorial stories by Tarun Suthar.",
};

export default async function StoriesPage() {
  return <Archive title="Stories" items={await getCategoryProjects("stories")} />;
}
