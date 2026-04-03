import { Metadata } from "next";
import {
  getPointsByCity,
  getTrailsByCity,
  getCityFromSlug,
  CITIES,
} from "@/app/lib/supabase";
import CityHeader from "@/app/components/CityHeader";
import CityClient from "./CityClient";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export const revalidate = 3600;

interface CityPageProps {
  params: { city: string };
}

export async function generateStaticParams() {
  return CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const cityName = getCityFromSlug(params.city);
  return {
    title: `${cityName} — Dancing with Lions`,
    description: `Discover the hidden cultural secrets of ${cityName}. Local knowledge, architecture, sacred places, and traditions.`,
    openGraph: {
      title: `${cityName} — Dancing with Lions`,
      description: `Discover the hidden cultural secrets of ${cityName}.`,
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const cityName = getCityFromSlug(params.city);
  const cityInfo = CITIES.find((c) => c.slug === params.city);
  const points = await getPointsByCity(cityName);
  const trails = await getTrailsByCity(cityName);

  if (!cityInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-serif text-2xl text-cream/60">City not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Nav */}
      <nav className="px-6 py-4">
        <Link
          href="/"
          className="font-serif text-xl text-cream hover:text-amber transition-colors"
        >
          Dancing with Lions
        </Link>
      </nav>

      <CityHeader city={cityName} points={points} />

      <CityClient
        points={points}
        trails={trails}
        cityInfo={cityInfo}
        citySlug={params.city}
      />

      <Footer />
    </div>
  );
}
