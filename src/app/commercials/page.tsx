import type { Metadata } from "next";
import { Archive } from "@/components/archive";
import { getCategoryProjects } from "@/lib/content";
export const dynamic="force-dynamic";

export const metadata: Metadata = {
  title: "Commercials",
  description: "Commercial photography and film work by Tarun Suthar.",
};

export default async function CommercialsPage() {
  return <Archive title="Commercials" items={await getCategoryProjects("commercials")} />;
}
