import { getAllPoints } from "@/app/lib/supabase";
import MapClient from "./map/MapClient";

export const revalidate = 3600;

export default async function HomePage() {
  const points = await getAllPoints();
  return <MapClient points={points} />;
}
