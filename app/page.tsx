import { getAllPoints } from "@/app/lib/supabase";
import ArchiveHome from "./ArchiveHome";

export const revalidate = 3600;

export default async function HomePage() {
  const points = await getAllPoints();

  // Randomise order server-side (Hermetic: Vibration — the archive moves)
  const shuffled = [...points].sort(() => Math.random() - 0.5);

  return <ArchiveHome points={shuffled} />;
}
