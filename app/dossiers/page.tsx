import { Metadata } from "next";
import { getAllPoints } from "@/app/lib/supabase";
import ArchiveHome from "../ArchiveHome";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Cultural Dossiers — Dancing with Lions",
  description: "Explore cultural dossiers connecting real people and real places across the globe.",
};

export default async function DossiersPage() {
  const points = await getAllPoints();
  const shuffled = [...points].sort(() => Math.random() - 0.5);
  return <ArchiveHome points={shuffled} />;
}
