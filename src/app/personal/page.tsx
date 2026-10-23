import type { Metadata } from "next";
import { Archive } from "@/components/archive";
import { getCategoryProjects } from "@/lib/content";
export const dynamic="force-dynamic";

export const metadata: Metadata = {
  title: "Personal",
  description: "Personal photography and image-making by Tarun Suthar.",
};

export default async function PersonalPage() {
  return <Archive title="Personal" items={await getCategoryProjects("personal")} />;
}
