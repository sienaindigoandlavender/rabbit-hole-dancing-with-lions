import { getAllPoints } from "@/app/lib/supabase";
import HomeClient from "./HomeClient";

export const revalidate = 3600;

export default async function HomePage() {
  const points = await getAllPoints();

  return <HomeClient points={points} />;
}
