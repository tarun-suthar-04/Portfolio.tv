import type { Metadata } from "next";
import { Archive } from "@/components/archive";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Commercials",
  description: "Commercial photography and film work by Tarun Suthar.",
};

export default function CommercialsPage() {
  return <Archive title="Commercials" items={projects.filter((project) => project.category === "Commercials")} />;
}
