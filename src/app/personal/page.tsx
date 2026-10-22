import type { Metadata } from "next";
import { Archive } from "@/components/archive";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Personal",
  description: "Personal photography and image-making by Tarun Suthar.",
};

export default function PersonalPage() {
  return <Archive title="Personal" items={projects.filter((project) => project.category === "Personal")} />;
}
