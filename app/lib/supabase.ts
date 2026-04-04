import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface DecoderPoint {
  id: string;
  city: string;
  title: string;
  question: string;
  answer: string;
  category: string;
  lat: number;
  lng: number;
  trail: string | null;
  darija_word: string | null;
  darija_meaning: string | null;
  darija_literal: string | null;
  darija_context: string | null;
  mj_prompt: string | null;
  hero_image: string | null;
  photo_url: string | null;
  photo_credit: string | null;
}

export interface DecoderTrail {
  id: string;
  city: string;
  title: string;
  description: string;
  bonus_card: string | null;
  point_ids: string[];
}

export async function getAllPoints(): Promise<DecoderPoint[]> {
  if (!supabase) {
    console.log("[DWL] Supabase client not initialised — missing env vars");
    return [];
  }

  console.log("[DWL] Fetching points from decoder_points...");
  console.log("[DWL] Supabase URL:", supabaseUrl);

  const { data, error } = await supabase
    .from("decoder_points")
    .select("*")
    .order("city", { ascending: true });

  if (error) {
    console.error("[DWL] Error fetching points:", error);
    return [];
  }

  console.log(`[DWL] Fetched ${data?.length || 0} points`);
  if (data && data.length > 0) {
    console.log("[DWL] Sample point:", JSON.stringify(data[0], null, 2));
    console.log("[DWL] Point has lat:", typeof data[0].lat, data[0].lat);
    console.log("[DWL] Point has lng:", typeof data[0].lng, data[0].lng);
  }

  return data || [];
}

export async function getPointsByCity(city: string): Promise<DecoderPoint[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("decoder_points")
    .select("*")
    .eq("city", city)
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching points for city:", error);
    return [];
  }
  return data || [];
}

export async function getPointById(id: string): Promise<DecoderPoint | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("decoder_points")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching point:", error);
    return null;
  }
  return data;
}

export async function getTrailsByCity(city: string): Promise<DecoderTrail[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("decoder_trails")
    .select("*")
    .eq("city", city);

  if (error) {
    console.error("Error fetching trails:", error);
    return [];
  }
  return data || [];
}

export async function getTrailById(id: string): Promise<DecoderTrail | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("decoder_trails")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching trail:", error);
    return null;
  }
  return data;
}

export function getCitySlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, "-");
}

export function getCityFromSlug(slug: string): string {
  const cityMap: Record<string, string> = {
    marrakech: "Marrakech",
    fes: "Fes",
    essaouira: "Essaouira",
    rabat: "Rabat",
    tangier: "Tangier",
    casablanca: "Casablanca",
    ouarzazate: "Ouarzazate",
    agadir: "Agadir",
  };
  return cityMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

export const CITIES = [
  { name: "Marrakech", slug: "marrakech", center: [-7.989, 31.629] as [number, number], zoom: 14 },
  { name: "Fes", slug: "fes", center: [-4.974, 34.063] as [number, number], zoom: 14 },
  { name: "Essaouira", slug: "essaouira", center: [-9.770, 31.513] as [number, number], zoom: 14 },
  { name: "Rabat", slug: "rabat", center: [-6.832, 34.020] as [number, number], zoom: 13 },
  { name: "Tangier", slug: "tangier", center: [-5.813, 35.785] as [number, number], zoom: 13 },
  { name: "Casablanca", slug: "casablanca", center: [-7.619, 33.593] as [number, number], zoom: 13 },
  { name: "Ouarzazate", slug: "ouarzazate", center: [-6.893, 30.920] as [number, number], zoom: 11 },
  { name: "Agadir", slug: "agadir", center: [-9.598, 30.427] as [number, number], zoom: 13 },
];
