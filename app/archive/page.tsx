import { Metadata } from "next";
import { getAllPoints } from "@/app/lib/supabase";
import ArchiveHome from "../ArchiveHome";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Archive — Dancing with Lions",
  description: "Browse the full archive of hidden knowledge. Every entry is a person. Every story is true.",
};

export default async function ArchivePage() {
  const points = await getAllPoints();
  const shuffled = [...points].sort(() => Math.random() - 0.5);
  return <ArchiveHome points={shuffled} />;
}
