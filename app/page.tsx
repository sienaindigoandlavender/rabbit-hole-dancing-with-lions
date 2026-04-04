import { getAllPoints } from "@/app/lib/supabase";
import MapClient from "./map/MapClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const points = await getAllPoints();
  console.log(`[DWL] Homepage received ${points.length} points for map`);
  return <MapClient points={points} />;
}
