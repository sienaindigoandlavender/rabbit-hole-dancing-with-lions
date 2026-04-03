import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const { data, error } = await supabase
    .from("decoder_points")
    .select("*")
    .order("city", { ascending: true });

  if (error) {
    console.error("Error fetching points:", error);
    return [];
  }
  return data || [];
}

export async function getPointsByCity(city: string): Promise<DecoderPoint[]> {
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
  { name: "Marrakech", slug: "marrakech", lat: 31.6295, lng: -7.9811 },
  { name: "Fes", slug: "fes", lat: 34.0331, lng: -5.0003 },
  { name: "Essaouira", slug: "essaouira", lat: 31.5085, lng: -9.7595 },
  { name: "Rabat", slug: "rabat", lat: 34.0209, lng: -6.8416 },
  { name: "Tangier", slug: "tangier", lat: 35.7595, lng: -5.834 },
  { name: "Casablanca", slug: "casablanca", lat: 33.5731, lng: -7.5898 },
  { name: "Ouarzazate", slug: "ouarzazate", lat: 30.9189, lng: -6.8936 },
  { name: "Agadir", slug: "agadir", lat: 30.4278, lng: -9.5981 },
];
