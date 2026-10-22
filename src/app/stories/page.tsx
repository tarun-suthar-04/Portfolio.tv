import type { Metadata } from "next";
import { Archive } from "@/components/archive";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Stories",
  description: "Documentary and editorial stories by Tarun Suthar.",
};

export default function StoriesPage() {
  return <Archive title="Stories" items={projects.filter((project) => project.category === "Stories")} />;
}
