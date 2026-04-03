import { getAllPoints } from "@/app/lib/supabase";
import MapClient from "./MapClient";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "The Map — Dancing with Lions",
  description: "Explore the archive on the map. Every dot is a secret. Every secret is a person.",
};

export default async function MapPage() {
  const points = await getAllPoints();
  return <MapClient points={points} />;
}
